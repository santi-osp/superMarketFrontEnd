import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PagoCreate, PagoRead, PagoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly base = `${environment.apiUrl}/pagos`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<PagoRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<PagoRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<PagoRead> {
    return this.http.get<PagoRead>(`${this.base}/${id}`);
  }

  create(body: PagoCreate): Observable<PagoRead> {
    return this.http.post<PagoRead>(`${this.base}/`, body);
  }

  update(id: string, body: PagoUpdate): Observable<PagoRead> {
    return this.http.put<PagoRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
