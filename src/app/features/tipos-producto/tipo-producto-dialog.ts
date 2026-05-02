import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TipoProductoService } from '../../core/services/tipo-producto.service';
import { TipoProductoRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

export interface TipoProductoDialogData {
  mode: 'create' | 'edit';
  row?: TipoProductoRead;
}

@Component({
  selector: 'app-tipo-producto-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './tipo-producto-dialog.html',
})
export class TipoProductoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(TipoProductoService);
  private readonly ref = inject(MatDialogRef<TipoProductoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<TipoProductoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    estado: [true],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre ?? '',
        descripcion: r.descripcion ?? '',
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

    const v = this.form.getRawValue();
    const body = {
      nombre: v.nombre,
      descripcion: v.descripcion || null,
      estado: v.estado,
    };

    const req =
      this.data.mode === 'create'
        ? this.svc.create(body)
        : this.svc.update(this.data.row!.id, body);

    req.subscribe({
      next: () => this.ref.close(true),
      error: (err: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 }),
    });
  }
}
