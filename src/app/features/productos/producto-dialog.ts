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
import { CategoriaService } from '../../core/services/categoria.service';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaRead, ProductoRead } from '../../models/api.models';

export interface ProductoDialogData {
  mode: 'create' | 'edit';
  row?: ProductoRead;
}

@Component({
  selector: 'app-producto-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './producto-dialog.html',
})
export class ProductoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(ProductoService);
  private readonly catSvc = inject(CategoriaService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<ProductoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<ProductoDialogData>(MAT_DIALOG_DATA);

  readonly categorias = signal<CategoriaRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    id_categoria: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: [''],
  });

  ngOnInit(): void {
    this.catSvc.list().subscribe({
      next: (rows) => this.categorias.set(rows),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_categoria: r.id_categoria,
        nombre: r.nombre,
        descripcion: r.descripcion ?? '',
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
          id_categoria: v.id_categoria,
          nombre: v.nombre,
          descripcion: v.descripcion || null,
          id_usuario_creacion: uid,
        })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
      return;
    }
    this.svc
      .update(this.data.row!.id_producto, {
        id_categoria: v.id_categoria,
        nombre: v.nombre,
        descripcion: v.descripcion || null,
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
