import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth/profile`;

  getProfile() {

    return this.http.get<UserProfile>(this.apiUrl);

  }

}
