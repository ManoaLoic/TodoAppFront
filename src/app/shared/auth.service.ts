import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT, ME_KEY, TOKEN_KEY } from './constants';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../users/user.model';
import { AuthResponse, AuthUser } from './authResponse.model';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  uri = `${API_ENDPOINT}/auth`;

  doAuth(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.uri, { email, password });
  }  

  getAuthToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): AuthUser {
    const userData = sessionStorage.getItem(ME_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getAuthToken();
    const isLoggedIn = !!token && !this.isTokenExpired(token);
    console.log("isLoggedIn:", isLoggedIn);
    return isLoggedIn;
  }

  logIn(token: string, user: AuthUser) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(ME_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);  }

  logOut() {
    console.log("Déconnexion de l'utilisateur");
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ME_KEY);
    this.currentUserSubject.next(null);  }
    

  // isAdmin() {
  //   const promesse = new Promise((resolve, reject) => {
  //     resolve(this.loggedIn);
  //   });

  //   return promesse;
  // }

  isAdmin(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.isLoggedIn()) {
        resolve(false);
      } else {
        const currentUser = this.getCurrentUser();
        resolve(currentUser && currentUser.isAdmin);
      }
    });
  }

  //code jwt_decode inspirer par des codes de stackOverFlow

  isTokenExpired(token: string): boolean {
    const decoded: any = jwt_decode.jwtDecode(token);
    if (decoded.exp === undefined) {
      return false;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date.valueOf() < new Date().valueOf();
  }


}
