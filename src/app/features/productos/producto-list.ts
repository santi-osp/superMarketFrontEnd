import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { ProductoService } from '../../core/services/producto.service';
import { ProductoRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { money, shortId, yesNo } from '../../shared/ids';
import { ProductoDialogComponent, ProductoDialogData } from './producto-dialog';
@Component({
  selector: 'app-producto-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.scss',
})
export class ProductoListComponent implements AfterViewInit {
  private readonly svc = inject(ProductoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  readonly displayedColumns = [
    'nombre',
    'codigo_barras',
    'precio_venta',
    'id_tipo',
    'id_proveedor',
    'estado',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<ProductoRead>([]);
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
  yesNo = yesNo;
  reload(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (rows) => {
        this.dataSource.data = rows;
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
  editar(row: ProductoRead): void {
    this.open({ mode: 'edit', row });
  }
  eliminar(row: ProductoRead): void {
    if (!confirm(`?Eliminar producto ${row.nombre}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Producto eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 }),
    });
  }
  private open(data: ProductoDialogData): void {
    this.dialog
      .open(ProductoDialogComponent, { width: '640px', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }
}
