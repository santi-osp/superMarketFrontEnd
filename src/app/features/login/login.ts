import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { AuditContextService } from '../../core/audit-context.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly audit = inject(AuditContextService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly submitting = signal(false);
  readonly hidePassword = signal(true);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.maxLength(128)]],
  });

  readonly usernameCtrl = this.loginForm.controls.username;
  readonly passwordCtrl = this.loginForm.controls.password;

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl('/app');
    }
  }

  ingresar(): void {
    if (this.loginForm.invalid || this.submitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const form = this.loginForm.getRawValue();
    this.submitting.set(true);

    this.auth
      .login({
        username: form.username,
        password: form.password,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (user) => {
          this.audit.select(user.id);
          this.snack.open(`Bienvenido, ${user.username}`, 'Cerrar', { duration: 2500 });
          void this.router.navigateByUrl('/app');
        },
        error: (err: HttpErrorResponse) => {
          this.snack.open(this.msg(err), 'Cerrar', { duration: 5000 });
        },
      });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((current) => !current);
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}
