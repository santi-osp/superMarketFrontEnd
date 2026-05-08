import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ProveedorCreate, ProveedorRead, ProveedorUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private readonly base = `${environment.apiUrl}/proveedores`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<ProveedorRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<ProveedorRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<ProveedorRead> {
    return this.http.get<ProveedorRead>(`${this.base}/${id}`);
  }

  create(body: ProveedorCreate): Observable<ProveedorRead> {
    return this.http.post<ProveedorRead>(`${this.base}/`, body);
  }

  update(id: string, body: ProveedorUpdate): Observable<ProveedorRead> {
    return this.http.put<ProveedorRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
