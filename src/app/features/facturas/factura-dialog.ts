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

import { ClienteService } from '../../core/services/cliente.service';
import { EmpleadoService } from '../../core/services/empleado.service';
import { FacturaService } from '../../core/services/factura.service';
import { ProductoService } from '../../core/services/producto.service';
import { SucursalService } from '../../core/services/sucursal.service';
import {
  ClienteRead,
  EmpleadoRead,
  FacturaRead,
  ProductoRead,
  SucursalRead,
} from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

export interface FacturaDialogData {
  mode: 'create' | 'edit';
  row?: FacturaRead;
}

@Component({
  selector: 'app-factura-dialog',
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
  templateUrl: './factura-dialog.html',
})
export class FacturaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(FacturaService);
  private readonly clienteSvc = inject(ClienteService);
  private readonly empleadoSvc = inject(EmpleadoService);
  private readonly sucursalSvc = inject(SucursalService);
  private readonly productoSvc = inject(ProductoService);
  private readonly ref = inject(MatDialogRef<FacturaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<FacturaDialogData>(MAT_DIALOG_DATA);

  readonly clientes = signal<ClienteRead[]>([]);
  readonly empleados = signal<EmpleadoRead[]>([]);
  readonly sucursales = signal<SucursalRead[]>([]);
  readonly productos = signal<ProductoRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    id_cliente: ['', Validators.required],
    id_empleado: ['', Validators.required],
    id_sucursal: ['', Validators.required],
    metodo_pago: ['EFECTIVO'],
    id_producto: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    precio_unitario: [0, [Validators.required, Validators.min(0)]],
    estado: ['ACTIVA'],
  });

  ngOnInit(): void {
    this.clienteSvc.list().subscribe({ next: (r) => this.clientes.set(r), error: this.onError });
    this.empleadoSvc.list().subscribe({ next: (r) => this.empleados.set(r), error: this.onError });
    this.sucursalSvc.list().subscribe({ next: (r) => this.sucursales.set(r), error: this.onError });
    this.productoSvc.list().subscribe({ next: (r) => this.productos.set(r), error: this.onError });

    if (this.data.mode === 'edit' && this.data.row) {
      const row = this.data.row;
      const d0 = row.detalles?.[0];
      this.form.patchValue({
        id_cliente: row.id_cliente,
        id_empleado: row.id_empleado,
        id_sucursal: row.id_sucursal,
        metodo_pago: row.metodo_pago ?? 'EFECTIVO',
        id_producto: d0?.id_producto ?? '',
        cantidad: d0?.cantidad ?? 1,
        precio_unitario: Number(d0?.precio_unitario ?? 0),
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

    const v = this.form.getRawValue();
    const detalle = {
      id_producto: v.id_producto,
      cantidad: Number(v.cantidad),
      precio_unitario: Number(v.precio_unitario),
    };

    const req =
      this.data.mode === 'create'
        ? this.svc.create({
            id_cliente: v.id_cliente,
            id_empleado: v.id_empleado,
            id_sucursal: v.id_sucursal,
            metodo_pago: v.metodo_pago || null,
            detalles: [detalle],
          })
        : this.svc.update(this.data.row!.id, {
            metodo_pago: v.metodo_pago || null,
            estado: v.estado,
          });

    req.subscribe({
      next: () => this.ref.close(true),
      error: this.onError,
    });
  }

  private readonly onError = (err: HttpErrorResponse): void => {
    this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 });
  };
}
