import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CompraProveedorCreate,
  CompraProveedorRead,
  CompraProveedorUpdate,
  DetalleCompraCreate,
  DetalleCompraRead,
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CompraProveedorService {
  private readonly base = `${environment.apiUrl}/compras-proveedor`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<CompraProveedorRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<CompraProveedorRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<CompraProveedorRead> {
    return this.http.get<CompraProveedorRead>(`${this.base}/${id}`);
  }

  create(body: CompraProveedorCreate): Observable<CompraProveedorRead> {
    return this.http.post<CompraProveedorRead>(`${this.base}/`, body);
  }

  update(id: string, body: CompraProveedorUpdate): Observable<CompraProveedorRead> {
    return this.http.put<CompraProveedorRead>(`${this.base}/${id}`, body);
  }

  anular(id: string): Observable<CompraProveedorRead> {
    return this.http.patch<CompraProveedorRead>(`${this.base}/${id}/anular`, null);
  }

  addDetalle(id: string, body: DetalleCompraCreate): Observable<DetalleCompraRead> {
    return this.http.post<DetalleCompraRead>(`${this.base}/${id}/detalles`, body);
  }

  deleteDetalle(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/detalles/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
