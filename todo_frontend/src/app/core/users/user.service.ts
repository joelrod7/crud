import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreatePersonaDto, Persona } from './user.types';


const USERS_LIST_PATH = '/personas/';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  list(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}${USERS_LIST_PATH}`);
  }

  create(dto: CreatePersonaDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register/`, dto);
  }
}
