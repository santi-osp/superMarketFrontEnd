import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EmpleadoCreate, EmpleadoRead, EmpleadoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly base = `${environment.apiUrl}/empleados`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<EmpleadoRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<EmpleadoRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<EmpleadoRead> {
    return this.http.get<EmpleadoRead>(`${this.base}/${id}`);
  }

  create(body: EmpleadoCreate): Observable<EmpleadoRead> {
    return this.http.post<EmpleadoRead>(`${this.base}/`, body);
  }

  update(id: string, body: EmpleadoUpdate): Observable<EmpleadoRead> {
    return this.http.put<EmpleadoRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
