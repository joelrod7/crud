import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private token: TokenService) {}

  register(dto: any) { return this.http.post(`${this.baseUrl}/register/`, dto); }
  login(dto: any) {
    return this.http.post<{access:string, refresh?:string}>(`${this.baseUrl}/token/`, dto)
      .pipe(tap(res => this.token.setAccess(res.access)));
  }
  logout() { this.token.clear(); }
}
