import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';
  message = '';
  errorMessage = '';
  emailError = '';
  passwordError = '';
  isLoading = false;

  constructor(private auth: Auth, private router: Router) {}

  onLogin() {

    this.emailError = '';
    this.passwordError = '';

    if (!this.email.trim()) {
      this.emailError = 'Email is required';
    }

    if (!this.password.trim()) {
      this.passwordError = 'Password is required';
    }

    if (this.emailError || this.passwordError) {
      this.message = '';
      this.errorMessage = 'Please fix the highlighted fields';
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.auth.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.auth.saveToken(response.token);
        this.message = response.message;
        this.errorMessage = '';

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.message = '';
        this.errorMessage = error.error?.message || 'Login failed';
      }
    });

  }

}
