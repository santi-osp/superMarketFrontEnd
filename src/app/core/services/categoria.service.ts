import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CategoriaCreate, CategoriaRead, CategoriaUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly base = `${environment.apiUrl}/categorias`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<CategoriaRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<CategoriaRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<CategoriaRead> {
    return this.http.get<CategoriaRead>(`${this.base}/${id}`);
  }

  create(body: CategoriaCreate): Observable<CategoriaRead> {
    return this.http.post<CategoriaRead>(`${this.base}/`, body);
  }

  update(id: string, body: CategoriaUpdate): Observable<CategoriaRead> {
    return this.http.put<CategoriaRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
