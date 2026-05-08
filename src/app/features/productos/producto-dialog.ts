import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductoService } from '../../core/services/producto.service';
import { ProveedorService } from '../../core/services/proveedor.service';
import { TipoProductoService } from '../../core/services/tipo-producto.service';
import { ProductoRead, ProveedorRead, TipoProductoRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

export interface ProductoDialogData {
  mode: 'create' | 'edit';
  row?: ProductoRead;
}

@Component({
  selector: 'app-producto-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './producto-dialog.html',
})
export class ProductoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(ProductoService);
  private readonly tipoSvc = inject(TipoProductoService);
  private readonly provSvc = inject(ProveedorService);
  private readonly ref = inject(MatDialogRef<ProductoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<ProductoDialogData>(MAT_DIALOG_DATA);
  readonly tipos = signal<TipoProductoRead[]>([]);
  readonly proveedores = signal<ProveedorRead[]>([]);
  readonly saving = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    codigo_barras: [''],
    precio_venta: [0, [Validators.required, Validators.min(0.01)]],
    fecha_vencimiento: [''],
    id_tipo: [''],
    id_proveedor: [''],
    estado: [true],
  });

  ngOnInit(): void {
    this.tipoSvc.list().subscribe({
      next: (rows) => this.tipos.set(rows),
      error: (e: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(e), 'Cerrar', { duration: 6000 }),
    });
    this.provSvc.list().subscribe({
      next: (rows) => this.proveedores.set(rows),
      error: (e: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(e), 'Cerrar', { duration: 6000 }),
    });

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre,
        codigo_barras: r.codigo_barras ?? '',
        precio_venta: Number(r.precio_venta),
        fecha_vencimiento: r.fecha_vencimiento ? String(r.fecha_vencimiento).slice(0, 10) : '',
        id_tipo: r.id_tipo ?? '',
        id_proveedor: r.id_proveedor ?? '',
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
      nombre: v.nombre,
      codigo_barras: v.codigo_barras || null,
      precio_venta: v.precio_venta,
      fecha_vencimiento: v.fecha_vencimiento ? new Date(v.fecha_vencimiento).toISOString() : null,
      id_tipo: v.id_tipo || null,
      id_proveedor: v.id_proveedor || null,
      estado: v.estado,
    };

    const req =
      this.data.mode === 'create'
        ? this.svc.create(body)
        : this.svc.update(this.data.row!.id, body);

    req.subscribe({
      next: () => this.ref.close(true),
      error: (err: HttpErrorResponse) => {
        const msg = httpErrorMessage(err);
        this.apiError.set(msg);
        this.saving.set(false);
        this.snack.open(msg, 'Cerrar', { duration: 6000 });
      },
    });
  }
}
