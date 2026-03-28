import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IProfile } from '../../shared/models/IProfile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);


  public userData = signal<IProfile | null | undefined>(undefined);
  private uid = signal(localStorage.getItem('UID'));

  protected isMyself = signal(false);
  private routeSubscription!: Subscription;

  ngOnInit(): void {
    this.onCheckProfile();
  }
  
  constructor() {
  }

  onCheckProfile(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe({
      next: (params) => {
        const uid = params['userId'];
        if(uid) {
          this.onGetProfileByUsername(uid);
        }else{   
          this.onGetProfile(this.uid() || '');
        }
      }
    })

  }

  onGetProfile(uid: string): void {
    this.profileService.getProfile(uid).subscribe({
      next: (profile) => {
        this.userData.set(profile);
        console.log('profile', profile);
        this.isMyself.set(true);
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/not-found']);
      }
    })
  }

  onGetProfileByUsername(username: string): void {
    this.profileService.getProfileByUsername(username).subscribe({
      next: (profile) => {         
        this.userData.set(profile);
        console.log('profile', profile);
        this.checkIsMyself(this.authService.userData().uid, profile.uid);
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/not-found']);
      }
    })
  }

  checkIsMyself(uid1: string, uid2: string) {
    if(uid1 === uid2) {
      this.isMyself.set(true);
    }else{
      this.isMyself.set(false);
    }
  }

  onLogout(){
    this.authService.logout().subscribe();
  }


}
