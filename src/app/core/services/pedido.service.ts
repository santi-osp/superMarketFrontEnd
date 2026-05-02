import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PedidoCreate, PedidoRead, PedidoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly base = `${environment.apiUrl}/pedidos`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<PedidoRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<PedidoRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<PedidoRead> {
    return this.http.get<PedidoRead>(`${this.base}/${id}`);
  }

  create(body: PedidoCreate): Observable<PedidoRead> {
    return this.http.post<PedidoRead>(`${this.base}/`, body);
  }

  update(id: string, body: PedidoUpdate): Observable<PedidoRead> {
    return this.http.put<PedidoRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
