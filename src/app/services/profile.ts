import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

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

  private apiUrl = 'http://localhost:5000/api/auth/profile';

  getProfile() {

    return this.http.get<UserProfile>(this.apiUrl);

  }

}
