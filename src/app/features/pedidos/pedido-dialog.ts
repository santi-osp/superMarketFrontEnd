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
import { PedidoService } from '../../core/services/pedido.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { PedidoRead, UsuarioRead } from '../../models/api.models';

export interface PedidoDialogData {
  mode: 'create' | 'edit';
  row?: PedidoRead;
}

@Component({
  selector: 'app-pedido-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './pedido-dialog.html',
})
export class PedidoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(PedidoService);
  private readonly usuarioSvc = inject(UsuarioService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<PedidoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<PedidoDialogData>(MAT_DIALOG_DATA);

  readonly usuarios = signal<UsuarioRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    id_usuario: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: [''],
    estado: [''],
  });

  ngOnInit(): void {
    this.usuarioSvc.list().subscribe({
      next: (rows) => this.usuarios.set(rows),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_usuario: r.id_usuario,
        nombre: r.nombre,
        descripcion: r.descripcion ?? '',
        estado: r.estado ?? '',
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
          id_usuario: v.id_usuario,
          nombre: v.nombre,
          descripcion: v.descripcion || null,
          estado: v.estado || null,
          id_usuario_creacion: uid,
        })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
      return;
    }
    this.svc
      .update(this.data.row!.id_pedido, {
        id_usuario: v.id_usuario,
        nombre: v.nombre,
        descripcion: v.descripcion || null,
        estado: v.estado || null,
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
