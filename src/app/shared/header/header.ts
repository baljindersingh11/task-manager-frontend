import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  constructor(private auth: Auth, private router: Router) {}

  isLoggedIn() {

    return this.auth.isLoggedIn();

  }

  logout() {

    this.auth.logout();
    this.router.navigate(['/login']);

  }

}
