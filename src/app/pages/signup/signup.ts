import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  name = '';
  email = '';
  password = '';
  message = '';
  errorMessage = '';

  constructor(private auth: Auth, private router: Router) {}

  onSignup() {

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.auth.signup(userData).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error) => {
        this.message = '';
        this.errorMessage = error.error?.message || 'Signup failed';
      }
    });

  }

}
