import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TipoProductoCreate, TipoProductoRead, TipoProductoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class TipoProductoService {
  private readonly base = `${environment.apiUrl}/tipos-producto`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<TipoProductoRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<TipoProductoRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<TipoProductoRead> {
    return this.http.get<TipoProductoRead>(`${this.base}/${id}`);
  }

  create(body: TipoProductoCreate): Observable<TipoProductoRead> {
    return this.http.post<TipoProductoRead>(`${this.base}/`, body);
  }

  update(id: string, body: TipoProductoUpdate): Observable<TipoProductoRead> {
    return this.http.put<TipoProductoRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
