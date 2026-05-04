import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UsuarioCreate, UsuarioRead, UsuarioUpdate } from '../../models/api.models';

interface UsuarioApiRead {
  id: string;
  username: string;
  id_rol: string;
  estado: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = `${environment.apiUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<UsuarioRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http
      .get<UsuarioApiRead[]>(`${this.base}/`, { params })
      .pipe(map((rows) => rows.map((row) => this.toViewModel(row))));
  }

  get(id: string): Observable<UsuarioRead> {
    return this.http
      .get<UsuarioApiRead>(`${this.base}/${id}`)
      .pipe(map((row) => this.toViewModel(row)));
  }

  create(body: UsuarioCreate): Observable<UsuarioRead> {
    return this.http
      .post<UsuarioApiRead>(`${this.base}/`, body)
      .pipe(map((row) => this.toViewModel(row)));
  }

  update(id: string, body: UsuarioUpdate): Observable<UsuarioRead> {
    return this.http
      .put<UsuarioApiRead>(`${this.base}/${id}`, body)
      .pipe(map((row) => this.toViewModel(row)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }

  private toViewModel(user: UsuarioApiRead): UsuarioRead {
    return {
      id_usuario: user.id,
      nombre_completo: user.username,
      nombre_usuario: user.username,
      email: '',
      rol: user.id_rol,
      telefono: null,
      activo: user.estado,
    };
  }
}
