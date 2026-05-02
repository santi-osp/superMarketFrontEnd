import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ClienteCreate, ClienteRead, ClienteUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly base = `${environment.apiUrl}/clientes`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<ClienteRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<ClienteRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<ClienteRead> {
    return this.http.get<ClienteRead>(`${this.base}/${id}`);
  }

  create(body: ClienteCreate): Observable<ClienteRead> {
    return this.http.post<ClienteRead>(`${this.base}/`, body);
  }

  update(id: string, body: ClienteUpdate): Observable<ClienteRead> {
    return this.http.put<ClienteRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
