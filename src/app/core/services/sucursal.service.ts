import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SucursalCreate, SucursalRead, SucursalUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class SucursalService {
  private readonly base = `${environment.apiUrl}/sucursales`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<SucursalRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<SucursalRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<SucursalRead> {
    return this.http.get<SucursalRead>(`${this.base}/${id}`);
  }

  create(body: SucursalCreate): Observable<SucursalRead> {
    return this.http.post<SucursalRead>(`${this.base}/`, body);
  }

  update(id: string, body: SucursalUpdate): Observable<SucursalRead> {
    return this.http.put<SucursalRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
