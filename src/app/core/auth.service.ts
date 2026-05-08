import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const EXPIRES_AT_KEY = 'auth_expires_at';
const USER_KEY = 'auth_user';

export interface LoginCredentials {
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthUser {
  id: string;
  username: string;
  id_rol: string;
  estado: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly token = signal<string | null>(this.readStorage(ACCESS_TOKEN_KEY));
  private readonly expiresAt = signal<number | null>(this.readExpiresAt());
  private readonly user = signal<AuthUser | null>(this.readUser());

  readonly currentUser = this.user.asReadonly();
  readonly isAuthenticated = computed(() => this.hasValidSession());

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<AuthUser> {
    const payload: LoginCredentials = {
      username: credentials.username.trim(),
      password: credentials.password,
    };

    return this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((tokenResponse) => this.persistToken(tokenResponse)),
      switchMap(() => this.http.get<AuthUser>(`${environment.apiUrl}/auth/me`)),
      tap((user) => this.persistUser(user)),
      catchError((error: HttpErrorResponse) => {
        this.clearSession();
        return throwError(() => error);
      }),
    );
  }

  getAccessToken(): string | null {
    if (!this.hasValidSession()) {
      this.clearSession();
      return null;
    }
    return this.token();
  }

  clearSession(): void {
    this.token.set(null);
    this.expiresAt.set(null);
    this.user.set(null);
    this.removeStorage(ACCESS_TOKEN_KEY);
    this.removeStorage(EXPIRES_AT_KEY);
    this.removeStorage(USER_KEY);
  }

  private hasValidSession(): boolean {
    const token = this.token();
    if (!token) {
      return false;
    }

    const expiresAt = this.expiresAt();
    if (expiresAt === null) {
      return true;
    }

    return Date.now() < expiresAt;
  }

  private persistToken(tokenResponse: TokenResponse): void {
    const expiresAt = Date.now() + tokenResponse.expires_in * 1000;
    this.token.set(tokenResponse.access_token);
    this.expiresAt.set(expiresAt);
    this.writeStorage(ACCESS_TOKEN_KEY, tokenResponse.access_token);
    this.writeStorage(EXPIRES_AT_KEY, String(expiresAt));
  }

  private persistUser(user: AuthUser): void {
    this.user.set(user);
    this.writeStorage(USER_KEY, JSON.stringify(user));
  }

  private readStorage(key: string): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(key);
  }

  private writeStorage(key: string, value: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(key, value);
  }

  private removeStorage(key: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(key);
  }

  private readExpiresAt(): number | null {
    const raw = this.readStorage(EXPIRES_AT_KEY);
    if (!raw) {
      return null;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private readUser(): AuthUser | null {
    const raw = this.readStorage(USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
