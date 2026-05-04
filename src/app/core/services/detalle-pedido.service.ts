import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DetallePedidoCreate, DetallePedidoRead, DetallePedidoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class DetallePedidoService {
  private readonly base = `${environment.apiUrl}/detalles-pedido`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<DetallePedidoRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<DetallePedidoRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<DetallePedidoRead> {
    return this.http.get<DetallePedidoRead>(`${this.base}/${id}`);
  }

  create(body: DetallePedidoCreate): Observable<DetallePedidoRead> {
    return this.http.post<DetallePedidoRead>(`${this.base}/`, body);
  }

  update(id: string, body: DetallePedidoUpdate): Observable<DetallePedidoRead> {
    return this.http.put<DetallePedidoRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
