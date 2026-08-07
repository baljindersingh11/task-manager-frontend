import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/users`;

  createUser(name: string, email: string, password: string) {

    return this.http.post<any>(this.apiUrl, {
      name,
      email,
      password
    });

  }

}
