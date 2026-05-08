import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { SucursalService } from '../../core/services/sucursal.service';
import { SucursalRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
export interface SucursalDialogData {
  mode: 'create' | 'edit';
  row?: SucursalRead;
}
@Component({
  selector: 'app-sucursal-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './sucursal-dialog.html',
})
export class SucursalDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(SucursalService);
  private readonly ref = inject(MatDialogRef<SucursalDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<SucursalDialogData>(MAT_DIALOG_DATA);
  readonly saving = signal(false);
  readonly apiError = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    direccion: [''],
    gerente: [''],
    telefono: [''],
    estado: [true],
  });
  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre ?? '',
        direccion: r.direccion ?? '',
        gerente: r.gerente ?? '',
        telefono: r.telefono ?? '',
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
      direccion: v.direccion || null,
      gerente: v.gerente || null,
      telefono: v.telefono || null,
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
