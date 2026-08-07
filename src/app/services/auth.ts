import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class Auth {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;

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

  getRole() {

    const token = this.getToken();

    if (!token) {
      return '';
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch (error) {
      return '';
    }

  }

  isManager() {

    return this.getRole() === 'manager';

  }

  logout() {

    localStorage.removeItem('token');

  }

}
