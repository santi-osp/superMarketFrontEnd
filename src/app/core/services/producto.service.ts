import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ProductoCreate, ProductoRead, ProductoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly base = `${environment.apiUrl}/productos`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<ProductoRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http
      .get<ProductoRead[]>(`${this.base}/`, { params })
      .pipe(map((rows) => rows.map((row) => this.normalize(row))));
  }

  get(id: string): Observable<ProductoRead> {
    return this.http
      .get<ProductoRead>(`${this.base}/${id}`)
      .pipe(map((row) => this.normalize(row)));
  }

  create(body: ProductoCreate): Observable<ProductoRead> {
    return this.http
      .post<ProductoRead>(`${this.base}/`, body)
      .pipe(map((row) => this.normalize(row)));
  }

  update(id: string, body: ProductoUpdate): Observable<ProductoRead> {
    return this.http
      .put<ProductoRead>(`${this.base}/${id}`, body)
      .pipe(map((row) => this.normalize(row)));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }

  private normalize(row: ProductoRead): ProductoRead {
    return {
      ...row,
      id_producto: row.id,
      id_categoria: row.id_tipo ?? '',
      descripcion: row.codigo_barras ?? null,
    };
  }
}
