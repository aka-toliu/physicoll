import { Component, effect, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);

  public currentUserProfile = this.authService.userProfile();
  public currentUserData = this.authService.userData();

  ngOnInit(): void {
    console.log(this.authService.userProfile());
    console.log(this.authService.userData());
  }
  
  constructor() {
    effect(() => {
      this.currentUserProfile = this.authService.userProfile();
    });

    effect(() => {
      this.currentUserData = this.authService.userData();
    });
  }

  onLogout(){
    this.authService.logout().subscribe({
      next: (value) => { }
    })
  }


}
