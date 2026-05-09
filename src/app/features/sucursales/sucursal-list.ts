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
import { SucursalService } from '../../core/services/sucursal.service';
import { SucursalRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { yesNo } from '../../shared/ids';
import { setPagedData } from '../../shared/table-utils';
import { SucursalDialogComponent, SucursalDialogData } from './sucursal-dialog';

@Component({
  selector: 'app-sucursal-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './sucursal-list.html',
  styleUrl: './sucursal-list.scss',
})
export class SucursalListComponent implements AfterViewInit {
  private readonly svc = inject(SucursalService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly auth = inject(AuthService);

  readonly canManage = computed(() => this.auth.currentUser()?.id_rol === ROLE_IDS.ADMIN);
  readonly displayedColumns = ['nombre', 'direccion', 'gerente', 'telefono', 'estado', 'acciones'];
  readonly dataSource = new MatTableDataSource<SucursalRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.reload();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

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

  editar(row: SucursalRead): void {
    this.open({ mode: 'edit', row });
  }

  eliminar(row: SucursalRead): void {
    if (!confirm(`¿Eliminar sucursal ${row.nombre}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Registro eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private open(data: SucursalDialogData): void {
    this.dialog
      .open(SucursalDialogComponent, {
        width: '860px',
        maxWidth: '96vw',
        maxHeight: 'calc(100dvh - 32px)',
        data,
      })
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => this.reload());
  }
}
