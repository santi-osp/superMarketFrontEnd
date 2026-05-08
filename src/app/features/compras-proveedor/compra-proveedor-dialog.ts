import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CompraProveedorService } from '../../core/services/compra-proveedor.service';
import { ProductoService } from '../../core/services/producto.service';
import { ProveedorService } from '../../core/services/proveedor.service';
import { SucursalService } from '../../core/services/sucursal.service';
import {
  CompraProveedorRead,
  ProductoRead,
  ProveedorRead,
  SucursalRead,
} from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

export interface CompraProveedorDialogData {
  mode: 'create' | 'edit';
  row?: CompraProveedorRead;
}

@Component({
  selector: 'app-compra-proveedor-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
  ],
  templateUrl: './compra-proveedor-dialog.html',
})
export class CompraProveedorDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(CompraProveedorService);
  private readonly proveedorSvc = inject(ProveedorService);
  private readonly sucursalSvc = inject(SucursalService);
  private readonly productoSvc = inject(ProductoService);
  private readonly ref = inject(MatDialogRef<CompraProveedorDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<CompraProveedorDialogData>(MAT_DIALOG_DATA);

  readonly proveedores = signal<ProveedorRead[]>([]);
  readonly sucursales = signal<SucursalRead[]>([]);
  readonly productos = signal<ProductoRead[]>([]);
  readonly saving = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    id_proveedor: ['', Validators.required],
    id_sucursal: [''],
    id_producto: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    precio_compra: [0, [Validators.required, Validators.min(0.01)]],
    estado: ['ACTIVA'],
  });

  ngOnInit(): void {
    this.proveedorSvc
      .list()
      .subscribe({ next: (r) => this.proveedores.set(r), error: this.onError });
    this.sucursalSvc.list().subscribe({ next: (r) => this.sucursales.set(r), error: this.onError });
    this.productoSvc.list().subscribe({ next: (r) => this.productos.set(r), error: this.onError });

    if (this.data.mode === 'edit' && this.data.row) {
      const row = this.data.row;
      const d0 = row.detalles?.[0];
      this.form.patchValue({
        id_proveedor: row.id_proveedor,
        id_sucursal: row.id_sucursal ?? '',
        id_producto: d0?.id_producto ?? '',
        cantidad: d0?.cantidad ?? 1,
        precio_compra: Number(d0?.precio_compra ?? 0),
        estado: row.estado ?? 'ACTIVA',
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
    const detalle = {
      id_producto: v.id_producto,
      cantidad: Number(v.cantidad),
      precio_compra: Number(v.precio_compra),
    };

    const req =
      this.data.mode === 'create'
        ? this.svc.create({
            id_proveedor: v.id_proveedor,
            id_sucursal: v.id_sucursal || null,
            detalles: [detalle],
          })
        : this.svc.update(this.data.row!.id, {
            estado: v.estado,
          });

    req.subscribe({
      next: () => this.ref.close(true),
      error: (err: HttpErrorResponse) => this.onSaveError(err),
    });
  }

  private readonly onError = (err: HttpErrorResponse): void => {
    this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 });
  };

  private readonly onSaveError = (err: HttpErrorResponse): void => {
    const msg = httpErrorMessage(err);
    this.apiError.set(msg);
    this.saving.set(false);
    this.snack.open(msg, 'Cerrar', { duration: 6000 });
  };
}
