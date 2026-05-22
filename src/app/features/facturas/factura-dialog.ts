import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, concat, last, of, switchMap } from 'rxjs';

import { ClienteService } from '../../core/services/cliente.service';
import { EmpleadoService } from '../../core/services/empleado.service';
import { FacturaService } from '../../core/services/factura.service';
import { ProductoService } from '../../core/services/producto.service';
import { SucursalService } from '../../core/services/sucursal.service';
import {
  ClienteRead,
  DetalleFacturaCreate,
  DetalleFacturaRead,
  EmpleadoRead,
  FacturaRead,
  ProductoRead,
  SucursalRead,
} from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

type DetalleFacturaForm = FormGroup<{
  id: FormControl<string>;
  id_producto: FormControl<string>;
  cantidad: FormControl<number>;
  precio_unitario: FormControl<number>;
}>;

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
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatTooltipModule,
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
  readonly saving = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    id_cliente: ['', Validators.required],
    id_empleado: ['', Validators.required],
    id_sucursal: ['', Validators.required],
    metodo_pago: ['EFECTIVO'],
    estado: ['emitida'],
    detalles: this.fb.array<DetalleFacturaForm>([], Validators.minLength(1)),
  });

  get detalles(): FormArray<DetalleFacturaForm> {
    return this.form.controls.detalles;
  }

  ngOnInit(): void {
    this.clienteSvc.list().subscribe({ next: (r) => this.clientes.set(r), error: this.onError });
    this.empleadoSvc.list().subscribe({ next: (r) => this.empleados.set(r), error: this.onError });
    this.sucursalSvc.list().subscribe({ next: (r) => this.sucursales.set(r), error: this.onError });
    this.productoSvc.list().subscribe({ next: (r) => this.productos.set(r), error: this.onError });

    if (this.data.mode === 'edit' && this.data.row) {
      const row = this.data.row;
      this.form.patchValue({
        id_cliente: row.id_cliente,
        id_empleado: row.id_empleado,
        id_sucursal: row.id_sucursal,
        metodo_pago: row.metodo_pago ?? 'EFECTIVO',
        estado: row.estado ?? 'emitida',
      });
      this.form.controls.id_cliente.disable();
      this.form.controls.id_empleado.disable();
      this.form.controls.id_sucursal.disable();
      row.detalles.forEach((detalle) => this.detalles.push(this.createDetalleGroup(detalle)));
    }

    if (this.detalles.length === 0) {
      this.addDetalle();
    }
  }

  addDetalle(): void {
    this.detalles.push(this.createDetalleGroup());
    this.detalles.markAsDirty();
  }

  removeDetalle(index: number): void {
    if (this.detalles.length <= 1) return;
    this.detalles.removeAt(index);
    this.detalles.markAsDirty();
  }

  trackDetalle(index: number, control: DetalleFacturaForm): string {
    return control.controls.id.value || `nuevo-${index}`;
  }

  setProductPrice(detalle: DetalleFacturaForm): void {
    const producto = this.productos().find(
      (item) => item.id === detalle.controls.id_producto.value
    );
    const precioVenta = Number(producto?.precio_venta);

    if (!Number.isFinite(precioVenta) || precioVenta <= 0) {
      return;
    }

    detalle.controls.precio_unitario.setValue(precioVenta);
    detalle.controls.precio_unitario.markAsDirty();
  }

  cancel(): void {
    this.ref.close(false);
  }

  save(): void {
    if (this.form.invalid || this.detalles.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.apiError.set(null);
    const v = this.form.getRawValue();
    const detalles = this.detallesPayload();

    const req =
      this.data.mode === 'create'
        ? this.svc.create({
            id_cliente: v.id_cliente,
            id_empleado: v.id_empleado,
            id_sucursal: v.id_sucursal,
            metodo_pago: v.metodo_pago || null,
            detalles,
          })
        : this.svc
            .update(this.data.row!.id, {
              metodo_pago: v.metodo_pago || null,
              estado: v.estado,
            })
            .pipe(
              switchMap(() =>
                this.syncDetalles(this.data.row!.id, this.data.row?.detalles ?? [])
              )
            );

    req.subscribe({
      next: () => this.ref.close(true),
      error: (err: HttpErrorResponse) => this.onSaveError(err),
    });
  }

  private createDetalleGroup(detalle?: DetalleFacturaRead): DetalleFacturaForm {
    return this.fb.nonNullable.group({
      id: [detalle?.id ?? ''],
      id_producto: [detalle?.id_producto ?? '', Validators.required],
      cantidad: [Number(detalle?.cantidad ?? 1), [Validators.required, Validators.min(1)]],
      precio_unitario: [
        Number(detalle?.precio_unitario ?? 0),
        [Validators.required, Validators.min(0.01)],
      ],
    });
  }

  private detallesPayload(): DetalleFacturaCreate[] {
    return this.detalles.getRawValue().map((detalle) => ({
      id_producto: detalle.id_producto,
      cantidad: Number(detalle.cantidad),
      precio_unitario: Number(detalle.precio_unitario),
    }));
  }

  private syncDetalles(facturaId: string, originales: DetalleFacturaRead[]): Observable<unknown> {
    const detalles = this.detalles.getRawValue();
    const idsActuales = new Set(detalles.map((detalle) => detalle.id).filter(Boolean));
    const operaciones: Observable<unknown>[] = [
      ...originales
        .filter((detalle) => !idsActuales.has(detalle.id))
        .map((detalle) => this.svc.deleteDetalle(detalle.id)),
      ...detalles
        .filter((detalle) => !!detalle.id)
        .map((detalle) =>
          this.svc.updateDetalle(detalle.id, {
            id_producto: detalle.id_producto,
            cantidad: Number(detalle.cantidad),
            precio_unitario: Number(detalle.precio_unitario),
          })
        ),
      ...detalles
        .filter((detalle) => !detalle.id)
        .map((detalle) =>
          this.svc.addDetalle(facturaId, {
            id_producto: detalle.id_producto,
            cantidad: Number(detalle.cantidad),
            precio_unitario: Number(detalle.precio_unitario),
          })
        ),
    ];

    return this.runSequentially(operaciones);
  }

  private runSequentially(operaciones: Observable<unknown>[]): Observable<unknown> {
    if (operaciones.length === 0) {
      return of(null);
    }
    return concat(...operaciones).pipe(last());
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
