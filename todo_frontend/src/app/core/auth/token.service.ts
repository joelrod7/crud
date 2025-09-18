import { Injectable, signal } from '@angular/core';
const ACCESS_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private _access = signal<string | null>(localStorage.getItem(ACCESS_KEY));
  get access() { return this._access.asReadonly(); }
  getAccess() { return localStorage.getItem(ACCESS_KEY); }
  setAccess(t: string) { localStorage.setItem(ACCESS_KEY, t); this._access.set(t); }
  clear() { localStorage.removeItem(ACCESS_KEY); this._access.set(null); }
  hasToken() { return !!this.getAccess(); }
}
