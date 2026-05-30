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

import { CompraProveedorService } from '../../core/services/compra-proveedor.service';
import { ProductoService } from '../../core/services/producto.service';
import { ProveedorService } from '../../core/services/proveedor.service';
import { SucursalService } from '../../core/services/sucursal.service';
import {
  CompraProveedorRead,
  DetalleCompraCreate,
  DetalleCompraRead,
  ProductoRead,
  ProveedorRead,
  SucursalRead,
} from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

type DetalleCompraForm = FormGroup<{
  id: FormControl<string>;
  id_producto: FormControl<string>;
  cantidad: FormControl<number>;
  precio_compra: FormControl<number>;
}>;

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
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatTooltipModule,
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
    estado: ['recibida'],
    detalles: this.fb.array<DetalleCompraForm>([], Validators.minLength(1)),
  });

  get detalles(): FormArray<DetalleCompraForm> {
    return this.form.controls.detalles;
  }

  ngOnInit(): void {
    this.proveedorSvc
      .list()
      .subscribe({ next: (r) => this.proveedores.set(r), error: this.onError });
    this.sucursalSvc.list().subscribe({ next: (r) => this.sucursales.set(r), error: this.onError });
    this.productoSvc.list().subscribe({ next: (r) => this.productos.set(r), error: this.onError });

    if (this.data.mode === 'edit' && this.data.row) {
      const row = this.data.row;
      this.form.patchValue({
        id_proveedor: row.id_proveedor,
        id_sucursal: row.id_sucursal ?? '',
        estado: row.estado ?? 'recibida',
      });
      this.form.controls.id_proveedor.disable();
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

  trackDetalle(index: number, control: DetalleCompraForm): string {
    return control.controls.id.value || `nuevo-${index}`;
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
            id_proveedor: v.id_proveedor,
            id_sucursal: v.id_sucursal || null,
            detalles,
          })
        : this.svc
            .update(this.data.row!.id, {
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

  private createDetalleGroup(detalle?: DetalleCompraRead): DetalleCompraForm {
    return this.fb.nonNullable.group({
      id: [detalle?.id ?? ''],
      id_producto: [detalle?.id_producto ?? '', Validators.required],
      cantidad: [Number(detalle?.cantidad ?? 1), [Validators.required, Validators.min(1)]],
      precio_compra: [
        Number(detalle?.precio_compra ?? 0),
        [Validators.required, Validators.min(0.01)],
      ],
    });
  }

  private detallesPayload(): DetalleCompraCreate[] {
    return this.detalles.getRawValue().map((detalle) => ({
      id_producto: detalle.id_producto,
      cantidad: Number(detalle.cantidad),
      precio_compra: Number(detalle.precio_compra),
    }));
  }

  private syncDetalles(compraId: string, originales: DetalleCompraRead[]): Observable<unknown> {
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
            precio_compra: Number(detalle.precio_compra),
          })
        ),
      ...detalles
        .filter((detalle) => !detalle.id)
        .map((detalle) =>
          this.svc.addDetalle(compraId, {
            id_producto: detalle.id_producto,
            cantidad: Number(detalle.cantidad),
            precio_compra: Number(detalle.precio_compra),
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
