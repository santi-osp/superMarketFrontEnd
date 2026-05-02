import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RolService } from '../../core/services/rol.service';
import { RolRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
export interface RolDialogData {
  mode: 'create' | 'edit';
  row?: RolRead;
}
@Component({
  selector: 'app-rol-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './rol-dialog.html',
})
export class RolDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(RolService);
  private readonly ref = inject(MatDialogRef<RolDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<RolDialogData>(MAT_DIALOG_DATA);
  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    salario: [0],
    activo: [true],
  });
  constructor() {
    if (this.data.mode === 'edit' && this.data.row)
      this.form.patchValue({
        nombre: this.data.row.nombre,
        descripcion: this.data.row.descripcion ?? '',
        salario: Number(this.data.row.salario ?? 0),
        activo: this.data.row.activo,
      });
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
      salario: v.salario || null,
      activo: v.activo,
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
