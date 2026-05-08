import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EmpleadoService } from '../../core/services/empleado.service';
import { RolService } from '../../core/services/rol.service';
import { EmpleadoRead, RolRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

export interface EmpleadoDialogData {
  mode: 'create' | 'edit';
  row?: EmpleadoRead;
}

@Component({
  selector: 'app-empleado-dialog',
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
  templateUrl: './empleado-dialog.html',
})
export class EmpleadoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(EmpleadoService);
  private readonly rolSvc = inject(RolService);
  private readonly ref = inject(MatDialogRef<EmpleadoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<EmpleadoDialogData>(MAT_DIALOG_DATA);
  readonly roles = signal<RolRead[]>([]);
  readonly saving = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    tipo_identificacion: ['CC', Validators.required],
    identificacion: ['', Validators.required],
    username: ['', Validators.required],
    password: [''],
    id_rol: ['', Validators.required],
    telefono: [''],
    direccion: [''],
    cargo: [''],
    salario: [''],
    estado: [true],
  });

  ngOnInit(): void {
    this.rolSvc.list().subscribe({
      next: (roles) => this.roles.set(roles.filter((x) => x.activo)),
      error: (e: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(e), 'Cerrar', { duration: 6000 }),
    });

    if (this.data.mode === 'create') {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls.password.updateValueAndValidity();
    }

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre,
        tipo_identificacion: r.tipo_identificacion,
        identificacion: r.identificacion,
        username: r.username,
        password: '',
        id_rol: r.id_rol,
        telefono: r.telefono ?? '',
        direccion: r.direccion ?? '',
        cargo: r.cargo ?? '',
        salario: r.salario ?? '',
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
    const body: any = {
      nombre: v.nombre,
      tipo_identificacion: v.tipo_identificacion,
      identificacion: v.identificacion,
      username: v.username,
      id_rol: v.id_rol,
      telefono: v.telefono || null,
      direccion: v.direccion || null,
      cargo: v.cargo || null,
      salario: v.salario || null,
      estado: v.estado,
    };

    if (this.data.mode === 'create' || v.password.trim()) {
      body.password = v.password;
    }

    const req =
      this.data.mode === 'create'
        ? this.svc.create(body)
        : this.svc.update(this.data.row!.id, body);

    req.subscribe({
      next: () => this.ref.close(true),
      error: (e: HttpErrorResponse) => {
        const msg = httpErrorMessage(e);
        this.apiError.set(msg);
        this.saving.set(false);
        this.snack.open(msg, 'Cerrar', { duration: 6000 });
      },
    });
  }
}
