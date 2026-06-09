import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService, UserProfile } from '../../services/profile';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profile: UserProfile | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit() {

    this.loadProfile();

  }

  loadProfile() {

    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Could not load profile';
      }
    });

  }

}
