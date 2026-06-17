import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class Auth {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;

  signup(userData: any) {

    return this.http.post(
      `${this.apiUrl}/signup`,
      userData
    );

  }

  login(credentials: any) {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      credentials
    );

  }

  saveToken(token: string) {

    localStorage.setItem('token', token);

  }

  getToken() {

    return localStorage.getItem('token');

  }

  isLoggedIn() {

    return !!this.getToken();

  }

  logout() {

    localStorage.removeItem('token');

  }

}
