import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  DetalleFacturaCreate,
  DetalleFacturaRead,
  DetalleFacturaUpdate,
  FacturaCreate,
  FacturaRead,
  FacturaUpdate,
} from '../../models/api.models';
import { FRONTEND_PAGE_LIMIT } from '../../shared/table-utils';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private readonly base = `${environment.apiUrl}/facturas`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<FacturaRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', FRONTEND_PAGE_LIMIT);
    return this.http.get<FacturaRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<FacturaRead> {
    return this.http.get<FacturaRead>(`${this.base}/${id}`);
  }

  create(body: FacturaCreate): Observable<FacturaRead> {
    return this.http.post<FacturaRead>(`${this.base}/`, body);
  }

  update(id: string, body: FacturaUpdate): Observable<FacturaRead> {
    return this.http.put<FacturaRead>(`${this.base}/${id}`, body);
  }

  anular(id: string): Observable<FacturaRead> {
    return this.http.patch<FacturaRead>(`${this.base}/${id}/anular`, null);
  }

  addDetalle(id: string, body: DetalleFacturaCreate): Observable<DetalleFacturaRead> {
    return this.http.post<DetalleFacturaRead>(`${this.base}/${id}/detalles`, body);
  }

  updateDetalle(id: string, body: DetalleFacturaUpdate): Observable<DetalleFacturaRead> {
    return this.http.put<DetalleFacturaRead>(`${this.base}/detalles/${id}`, body);
  }

  deleteDetalle(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/detalles/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
