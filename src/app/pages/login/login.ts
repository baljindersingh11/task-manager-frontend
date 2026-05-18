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
  isLoading = false;

  constructor(private auth: Auth, private router: Router) {}

  onLogin() {

    if (!this.email.trim() || !this.password.trim()) {
      this.message = '';
      this.errorMessage = 'Please enter email and password';
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
