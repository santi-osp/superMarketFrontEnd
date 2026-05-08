import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RolCreate, RolRead, RolUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly base = `${environment.apiUrl}/roles`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<RolRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<RolRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<RolRead> {
    return this.http.get<RolRead>(`${this.base}/${id}`);
  }

  create(body: RolCreate): Observable<RolRead> {
    return this.http.post<RolRead>(`${this.base}/`, body);
  }

  update(id: string, body: RolUpdate): Observable<RolRead> {
    return this.http.put<RolRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
