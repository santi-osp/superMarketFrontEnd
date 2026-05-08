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

import { RolService } from '../../core/services/rol.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { RolRead, UsuarioRead, UsuarioUpdate } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

export interface UsuarioDialogData {
  mode: 'create' | 'edit';
  row?: UsuarioRead;
}

@Component({
  selector: 'app-usuario-dialog',
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
  templateUrl: './usuario-dialog.html',
})
export class UsuarioDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);
  private readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<UsuarioDialogData>(MAT_DIALOG_DATA);
  readonly roles = signal<RolRead[]>([]);
  readonly saving = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: [''],
    id_rol: ['', Validators.required],
    estado: [true],
  });

  ngOnInit(): void {
    this.rolService.list().subscribe({
      next: (rows) => this.roles.set(rows.filter((rol) => rol.activo)),
      error: (err: HttpErrorResponse) => this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 6000 }),
    });

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        username: r.username,
        password: '',
        id_rol: r.id_rol,
        estado: r.estado,
      });
    }

    if (this.data.mode === 'create') {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls.password.updateValueAndValidity();
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

    this.saving.set(true);
    this.apiError.set(null);
    const value = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.usuarioService
        .create({
          username: value.username,
          password: value.password,
          id_rol: value.id_rol,
          estado: value.estado,
        })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: HttpErrorResponse) => this.onSaveError(err),
        });
      return;
    }

    const body: UsuarioUpdate = {
      username: value.username,
      id_rol: value.id_rol,
      estado: value.estado,
    };
    if (value.password.trim()) {
      body.password = value.password;
    }

    this.usuarioService.update(this.data.row!.id, body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) => this.onSaveError(err),
    });
  }

  private onSaveError(err: HttpErrorResponse): void {
    const msg = httpErrorMessage(err);
    this.apiError.set(msg);
    this.saving.set(false);
    this.snack.open(msg, 'Cerrar', { duration: 6000 });
  }
}
