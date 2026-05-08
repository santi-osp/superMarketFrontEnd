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

import { RolService } from '../../core/services/rol.service';
import { RolRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { money, yesNo } from '../../shared/ids';
import { setPagedData } from '../../shared/table-utils';
import { RolDialogComponent, RolDialogData } from './rol-dialog';

@Component({
  selector: 'app-rol-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './rol-list.html',
  styleUrl: './rol-list.scss',
})
export class RolListComponent implements AfterViewInit {
  private readonly svc = inject(RolService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  readonly displayedColumns = ['nombre', 'descripcion', 'salario', 'activo', 'acciones'];
  readonly dataSource = new MatTableDataSource<RolRead>([]);
  loading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor() {
    this.reload();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  money = money;
  yesNo = yesNo;
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
  editar(row: RolRead): void {
    this.open({ mode: 'edit', row });
  }
  eliminar(row: RolRead): void {
    if (!confirm(`¿Desactivar rol ${row.nombre}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Rol desactivado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 }),
    });
  }
  private open(data: RolDialogData): void {
    this.dialog
      .open(RolDialogComponent, {
        width: '720px',
        maxWidth: '96vw',
        maxHeight: 'calc(100dvh - 32px)',
        data,
      })
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => this.reload());
  }
}
