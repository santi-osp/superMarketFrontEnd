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

import { EmpleadoService } from '../../core/services/empleado.service';
import { EmpleadoRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { shortId, yesNo } from '../../shared/ids';
import { setPagedData } from '../../shared/table-utils';
import { EmpleadoDialogComponent, EmpleadoDialogData } from './empleado-dialog';
@Component({
  selector: 'app-empleado-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './empleado-list.html',
  styleUrl: './empleado-list.scss',
})
export class EmpleadoListComponent implements AfterViewInit {
  private readonly svc = inject(EmpleadoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  readonly displayedColumns = [
    'nombre',
    'username',
    'identificacion',
    'cargo',
    'id_rol',
    'estado',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<EmpleadoRead>([]);
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
      next: (r) => {
        setPagedData(this.dataSource, r, this.paginator);
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
  editar(row: EmpleadoRead): void {
    this.open({ mode: 'edit', row });
  }
  eliminar(row: EmpleadoRead): void {
    if (!confirm(`Eliminar empleado ${row.nombre}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Empleado eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (e: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(e), 'Cerrar', { duration: 6000 }),
    });
  }
  private open(data: EmpleadoDialogData): void {
    this.dialog
      .open(EmpleadoDialogComponent, {
        width: '1040px',
        maxWidth: '96vw',
        maxHeight: 'calc(100dvh - 32px)',
        data,
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }
}
