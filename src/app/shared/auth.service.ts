import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT, ME_KEY, TOKEN_KEY } from './constants';
import { Observable } from 'rxjs';
import { User } from '../users/user.model';
import { AuthResponse, AuthUser } from './authResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;

  constructor(private http: HttpClient) { }

  uri = `${API_ENDPOINT}/auth`;

  doAuth(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.uri, {email, password});
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): AuthUser {
    const userData = sessionStorage.getItem(ME_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  logIn() {
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }

  isAdmin() {
    const promesse = new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });

    return promesse;
  }
}
