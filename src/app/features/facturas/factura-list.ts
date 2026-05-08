import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';

import { FacturaService } from '../../core/services/factura.service';
import { FacturaRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { formatDate, money, shortId } from '../../shared/ids';
import { FRONTEND_PAGE_LIMIT, setPagedData } from '../../shared/table-utils';
import { FacturaDetailDialogComponent } from './factura-detail-dialog';
import { FacturaDialogComponent, FacturaDialogData } from './factura-dialog';

@Component({
  selector: 'app-factura-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './factura-list.html',
  styleUrl: './factura-list.scss',
})
export class FacturaListComponent implements AfterViewInit {
  private readonly svc = inject(FacturaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'id',
    'fecha',
    'id_cliente',
    'id_empleado',
    'id_sucursal',
    'detalles',
    'metodo_pago',
    'total',
    'estado',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<FacturaRead>([]);
  loading = true;
  errorMessage = '';
  readonly frontendLimit = FRONTEND_PAGE_LIMIT;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.reload();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  shortId = shortId;
  formatDate = formatDate;
  money = money;

  reload(): void {
    this.loading = true;
    this.errorMessage = '';
    this.svc.list().subscribe({
      next: (rows) => {
        setPagedData(this.dataSource, rows, this.paginator);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = httpErrorMessage(err);
        this.snack.open(this.errorMessage, 'Cerrar', { duration: 6000 });
      },
    });
  }

  nuevo(): void {
    this.open({ mode: 'create' });
  }

  editar(row: FacturaRead): void {
    this.open({ mode: 'edit', row });
  }

  verDetalles(row: FacturaRead): void {
    this.dialog.open(FacturaDetailDialogComponent, {
      width: '1080px',
      maxWidth: '96vw',
      maxHeight: 'calc(100dvh - 32px)',
      data: { id: row.id, fallback: row },
    });
  }

  anular(row: FacturaRead): void {
    if ((row.estado || '').toUpperCase() === 'ANULADA') {
      this.snack.open('La factura ya está anulada', 'OK', { duration: 2500 });
      return;
    }

    if (!confirm(`¿Anular factura ${shortId(row.id)}?`)) return;

    this.svc.anular(row.id).subscribe({
      next: () => {
        this.snack.open('Factura anulada', 'OK', { duration: 3000 });
        this.paginator?.firstPage();
        this.reload();
      },
      error: (err: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private open(data: FacturaDialogData): void {
    this.dialog
      .open(FacturaDialogComponent, {
        width: '1040px',
        maxWidth: '96vw',
        maxHeight: 'calc(100dvh - 32px)',
        data,
      })
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.paginator?.firstPage();
        this.reload();
      });
  }
}
