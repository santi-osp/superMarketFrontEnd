import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { InventarioCreate, InventarioRead, InventarioUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly base = `${environment.apiUrl}/inventarios`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<InventarioRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500).set('solo_activos', true);
    return this.http.get<InventarioRead[]>(`${this.base}/`, { params });
  }

  bajoMinimo(): Observable<InventarioRead[]> {
    return this.http.get<InventarioRead[]>(`${this.base}/bajo-minimo`);
  }

  get(id: string): Observable<InventarioRead> {
    return this.http.get<InventarioRead>(`${this.base}/${id}`);
  }

  create(body: InventarioCreate): Observable<InventarioRead> {
    return this.http.post<InventarioRead>(`${this.base}/`, body);
  }

  update(id: string, body: InventarioUpdate): Observable<InventarioRead> {
    return this.http.put<InventarioRead>(`${this.base}/${id}`, body);
  }

  ajustarStock(id: string, cantidad: number): Observable<InventarioRead> {
    const params = new HttpParams().set('cantidad', cantidad);
    return this.http.patch<InventarioRead>(`${this.base}/${id}/ajustar-stock`, null, { params });
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
