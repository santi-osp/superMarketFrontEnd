import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, computed, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../core/auth.service';
import { ROLE_IDS } from '../../core/constants/role-constants';
import { CompraProveedorService } from '../../core/services/compra-proveedor.service';
import { CompraProveedorRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { formatDate, money, shortId } from '../../shared/ids';
import { setPagedData } from '../../shared/table-utils';
import {
  CompraProveedorDialogComponent,
  CompraProveedorDialogData,
} from './compra-proveedor-dialog';

@Component({
  selector: 'app-compra-proveedor-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './compra-proveedor-list.html',
  styleUrl: './compra-proveedor-list.scss',
})
export class CompraProveedorListComponent implements AfterViewInit {
  private readonly svc = inject(CompraProveedorService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly auth = inject(AuthService);

  readonly canManage = computed(() => this.auth.currentUser()?.id_rol === ROLE_IDS.ADMIN);
  readonly displayedColumns = [
    'id',
    'fecha',
    'id_proveedor',
    'id_sucursal',
    'detalles',
    'total_compra',
    'estado',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<CompraProveedorRead>([]);

  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.reload();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  shortId = shortId;
  money = money;
  formatDate = formatDate;

  reload(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (rows) => {
        setPagedData(this.dataSource, rows, this.paginator);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 });
      },
    });
  }

  nuevo(): void {
    this.open({ mode: 'create' });
  }

  editar(row: CompraProveedorRead): void {
    this.open({ mode: 'edit', row });
  }

  anular(row: CompraProveedorRead): void {
    if ((row.estado || '').toUpperCase() === 'ANULADA') {
      this.snack.open('La compra ya está anulada', 'OK', { duration: 2500 });
      return;
    }
    if (!confirm(`¿Anular compra ${shortId(row.id)}?`)) return;

    this.svc.anular(row.id).subscribe({
      next: () => {
        this.snack.open('Compra anulada', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private open(data: CompraProveedorDialogData): void {
    this.dialog
      .open(CompraProveedorDialogComponent, {
        width: '1040px',
        maxWidth: '96vw',
        maxHeight: 'calc(100dvh - 32px)',
        data,
      })
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => this.reload());
  }
}
