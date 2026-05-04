import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuditContextService } from '../../core/audit-context.service';
import { PagoService } from '../../core/services/pago.service';
import { PedidoService } from '../../core/services/pedido.service';
import { PagoRead, PedidoRead } from '../../models/api.models';

export interface PagoDialogData {
  mode: 'create' | 'edit';
  row?: PagoRead;
}

@Component({
  selector: 'app-pago-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './pago-dialog.html',
})
export class PagoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(PagoService);
  private readonly pedidoSvc = inject(PedidoService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<PagoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<PagoDialogData>(MAT_DIALOG_DATA);

  readonly pedidos = signal<PedidoRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    id_pedido: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: [''],
    estado: [''],
    referencia: ['', Validators.required],
    tipo_pago: ['', Validators.required],
  });

  ngOnInit(): void {
    this.pedidoSvc.list().subscribe({
      next: (rows) => this.pedidos.set(rows),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_pedido: r.id_pedido,
        nombre: r.nombre,
        descripcion: r.descripcion ?? '',
        estado: r.estado ?? '',
        referencia: r.referencia,
        tipo_pago: r.tipo_pago,
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const uid = this.audit.usuarioId();
    if (!uid) {
      this.snack.open('Seleccione usuario de auditoría en la barra superior.', 'OK');
      return;
    }
    const v = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.svc
        .create({
          id_pedido: v.id_pedido,
          nombre: v.nombre,
          descripcion: v.descripcion || null,
          estado: v.estado || null,
          referencia: v.referencia,
          tipo_pago: v.tipo_pago,
          id_usuario_creacion: uid,
        })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
      return;
    }
    this.svc
      .update(this.data.row!.id_pago, {
        id_pedido: v.id_pedido,
        nombre: v.nombre,
        descripcion: v.descripcion || null,
        estado: v.estado || null,
        referencia: v.referencia,
        tipo_pago: v.tipo_pago,
        id_usuario_edita: uid,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}
