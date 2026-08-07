import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {

  name = '';
  email = '';
  password = '';
  message = '';
  errorMessage = '';
  nameError = '';
  emailError = '';
  passwordError = '';
  isLoading = false;

  constructor(private userService: UserService) {}

  createUser() {

    this.nameError = '';
    this.emailError = '';
    this.passwordError = '';

    if (!this.name.trim()) {
      this.nameError = 'Name is required';
    }

    if (!this.email.trim()) {
      this.emailError = 'Email is required';
    }

    if (!this.password.trim()) {
      this.passwordError = 'Temporary password is required';
    }

    if (this.nameError || this.emailError || this.passwordError) {
      this.message = '';
      this.errorMessage = 'Please fix the highlighted fields';
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    this.userService.createUser(
      this.name,
      this.email,
      this.password
    ).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.message = `User created: ${user.email}`;
        this.errorMessage = '';
        this.name = '';
        this.email = '';
        this.password = '';
      },
      error: (error) => {
        this.isLoading = false;
        this.message = '';
        this.errorMessage = error.error?.message || 'Could not create user';
      }
    });

  }

}
