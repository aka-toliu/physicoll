import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IProfile } from '../../shared/models/IProfile';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IconComponent],
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

  protected countCollection = signal(0);
  protected countLists = signal(0);
  protected countWishlist = signal(0);

  protected isLoading = computed(() => this.userData() === undefined);
  protected loadingCountColl = signal(true);
  protected loadingCountLists = signal(true);
  protected loadingCountWishlist = signal(true);

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
        this.getCounters(profile.uid);
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
        this.getCounters(profile.uid);
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

  getCounters(uid: string) {
    console.log('Obtendo contadores para UID:', uid);
    if (this.userData()) {
      this.profileService.getCount(uid, 'collection').subscribe({
        next: (count) => {this.countCollection.set(count); this.loadingCountColl.set(false)},
        error: (err) => console.error('Error ao obter contagem de coleção:', err)
      });
      this.profileService.getCount(uid, 'lists').subscribe({
        next: (count) => {this.countLists.set(count); this.loadingCountLists.set(false)}
      });
      this.profileService.getCount(uid, 'wishlist').subscribe({
        next: (count) => {this.countWishlist.set(count); this.loadingCountWishlist.set(false)}
      });
    }
  }

    navigateTo(route: string) {
    this.router.navigate(['/', route]);
  }

}