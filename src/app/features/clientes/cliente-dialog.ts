import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClienteService } from '../../core/services/cliente.service';
import { ClienteRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
export interface ClienteDialogData {
  mode: 'create' | 'edit';
  row?: ClienteRead;
}
@Component({
  selector: 'app-cliente-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './cliente-dialog.html',
})
export class ClienteDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(ClienteService);
  private readonly ref = inject(MatDialogRef<ClienteDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<ClienteDialogData>(MAT_DIALOG_DATA);
  readonly saving = signal(false);
  readonly apiError = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    tipo_identificacion: ['', Validators.required],
    identificacion: ['', Validators.required],
    email: ['', Validators.email],
    telefono: [''],
    direccion: [''],
    estado: [true],
  });
  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre ?? '',
        tipo_identificacion: r.tipo_identificacion ?? '',
        identificacion: r.identificacion ?? '',
        email: r.email ?? '',
        telefono: r.telefono ?? '',
        direccion: r.direccion ?? '',
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
      tipo_identificacion: v.tipo_identificacion,
      identificacion: v.identificacion,
      email: v.email || null,
      telefono: v.telefono || null,
      direccion: v.direccion || null,
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
