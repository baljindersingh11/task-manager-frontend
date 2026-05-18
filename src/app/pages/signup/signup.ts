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
  isLoading = false;

  constructor(private auth: Auth, private router: Router) {}

  onSignup() {

    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.message = '';
      this.errorMessage = 'Please fill in name, email, and password';
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.auth.signup(userData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.message = response.message;
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.message = '';
        this.errorMessage = error.error?.message || 'Signup failed';
      }
    });

  }

}
