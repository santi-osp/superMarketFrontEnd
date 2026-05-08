import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { InventarioService } from '../../core/services/inventario.service';
import { ProductoService } from '../../core/services/producto.service';
import { SucursalService } from '../../core/services/sucursal.service';
import { InventarioRead, ProductoRead, SucursalRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

export interface InventarioDialogData {
  mode: 'create' | 'edit';
  row?: InventarioRead;
}

@Component({
  selector: 'app-inventario-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './inventario-dialog.html',
})
export class InventarioDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(InventarioService);
  private readonly productoSvc = inject(ProductoService);
  private readonly sucursalSvc = inject(SucursalService);
  private readonly ref = inject(MatDialogRef<InventarioDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<InventarioDialogData>(MAT_DIALOG_DATA);
  readonly productos = signal<ProductoRead[]>([]);
  readonly sucursales = signal<SucursalRead[]>([]);
  readonly saving = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    id_producto: ['', Validators.required],
    id_sucursal: ['', Validators.required],
    stock_actual: [0, [Validators.required, Validators.min(0)]],
    stock_minimo: [0, [Validators.required, Validators.min(0)]],
    ubicacion: [''],
    estado: [true],
  });

  ngOnInit(): void {
    this.productoSvc.list().subscribe({
      next: (rows) => this.productos.set(rows.filter((x) => x.estado)),
      error: this.onError,
    });
    this.sucursalSvc.list().subscribe({
      next: (rows) => this.sucursales.set(rows.filter((x) => x.estado)),
      error: this.onError,
    });

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_producto: r.id_producto,
        id_sucursal: r.id_sucursal,
        stock_actual: r.stock_actual,
        stock_minimo: r.stock_minimo,
        ubicacion: r.ubicacion ?? '',
        estado: r.estado,
      });
    }
  }

  cancel(): void {
    this.ref.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.apiError.set(null);
    const v = this.form.getRawValue();
    const body = {
      id_producto: v.id_producto,
      id_sucursal: v.id_sucursal,
      stock_actual: Number(v.stock_actual),
      stock_minimo: Number(v.stock_minimo),
      ubicacion: v.ubicacion || null,
      estado: v.estado,
    };

    const req =
      this.data.mode === 'create'
        ? this.svc.create(body)
        : this.svc.update(this.data.row!.id, body);

    req.subscribe({
      next: () => this.ref.close(true),
      error: (e: HttpErrorResponse) => this.onSaveError(e),
    });
  }

  private readonly onError = (e: HttpErrorResponse): void => {
    this.snack.open(httpErrorMessage(e), 'Cerrar', { duration: 6000 });
  };

  private readonly onSaveError = (e: HttpErrorResponse): void => {
    const msg = httpErrorMessage(e);
    this.apiError.set(msg);
    this.saving.set(false);
    this.snack.open(msg, 'Cerrar', { duration: 6000 });
  };
}
