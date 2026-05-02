import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { InventarioService } from '../../core/services/inventario.service';
import { InventarioRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { shortId, yesNo } from '../../shared/ids';
import { InventarioDialogComponent, InventarioDialogData } from './inventario-dialog';

@Component({
  selector: 'app-inventario-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './inventario-list.html',
  styleUrl: './inventario-list.scss',
})
export class InventarioListComponent implements AfterViewInit {
  private readonly svc = inject(InventarioService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'id_producto',
    'id_sucursal',
    'stock_actual',
    'stock_minimo',
    'ubicacion',
    'estado',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<InventarioRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.reload();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  shortId = shortId;
  yesNo = yesNo;

  reload(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (rows) => {
        this.dataSource.data = rows;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.snack.open(httpErrorMessage(e), 'Cerrar', { duration: 6000 });
      },
    });
  }

  nuevo(): void {
    this.open({ mode: 'create' });
  }

  editar(row: InventarioRead): void {
    this.open({ mode: 'edit', row });
  }

  eliminar(row: InventarioRead): void {
    if (!confirm(`¿Eliminar inventario de producto ${shortId(row.id_producto)}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Inventario eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (e: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(e), 'Cerrar', { duration: 6000 }),
    });
  }

  private open(data: InventarioDialogData): void {
    this.dialog
      .open(InventarioDialogComponent, { width: '760px', data })
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => this.reload());
  }
}
