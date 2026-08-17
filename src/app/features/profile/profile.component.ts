import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SocialService } from '../../core/services/social.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IProfile } from '../../shared/models/IProfile';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { IFriendUser } from '../../shared/models/ISocial';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IconComponent, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private socialService = inject(SocialService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public userData = signal<IProfile | null | undefined>(undefined);
  private uid = signal(localStorage.getItem('UID'));

  protected countCollection = signal(0);
  protected countLists = signal(0);
  protected countWishlist = signal(0);

  protected followers = signal<IFriendUser[]>([]);
  protected following = signal<IFriendUser[]>([]);
  public openModalFollowers = signal(false);
  public openModalFollowing = signal(false);

  protected isFollowing = computed(() => {
    const myUid = this.authService.userData()?.uid || this.uid();
    return this.followers().some(follower => follower.UID === myUid);
  });

  protected isLoading = computed(() => this.userData() === undefined);
  protected loadingCountColl = signal(true);
  protected loadingCountLists = signal(true);
  protected loadingCountWishlist = signal(true);

  protected isMyself = signal(false);

  private routeSubscription!: Subscription;
  private followersSubscription?: Subscription;
  private followingSubscription?: Subscription;

  ngOnInit(): void {
    this.onCheckProfile();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
    if (this.followersSubscription) this.followersSubscription.unsubscribe();
    if (this.followingSubscription) this.followingSubscription.unsubscribe();
  }

  onCheckProfile(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe({
      next: (params) => {
        const usernameParam = params['userId'];
        if (usernameParam) {
          this.onGetProfileByUsername(usernameParam);
        } else {
          const myUid = this.uid() || '';
          this.onGetProfile(myUid);
          this.setupRealtimeSocialData(myUid);
        }
      }
    });
  }

  onGetProfile(uid: string): void {
    this.profileService.getProfile(uid).pipe(take(1)).subscribe({
      next: (profile) => {
        this.userData.set(profile);
        this.getCounters(profile.uid);
        this.isMyself.set(true);
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/not-found']);
      }
    });
  }

  onGetProfileByUsername(username: string): void {
    this.profileService.getProfileByUsername(username).pipe(take(1)).subscribe({
      next: (profile) => {
        if (!profile) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.userData.set(profile);
        this.getCounters(profile.uid);

        const myLoggedUid = this.authService.userData()?.uid || this.uid() || '';
        this.checkIsMyself(myLoggedUid, profile.uid);

        // Ativa o listener em tempo real para os seguidores/seguindo
        this.setupRealtimeSocialData(profile.uid);
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/not-found']);
      }
    });
  }

  checkIsMyself(uid1: string, uid2: string): void {
    this.isMyself.set(uid1 === uid2);
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }

  getCounters(uid: string): void {
    if (!uid) return;

    this.profileService.getCount(uid, 'collection').pipe(take(1)).subscribe({
      next: (count) => { this.countCollection.set(count); this.loadingCountColl.set(false); },
      error: (err) => console.error('Erro ao obter contagem de coleção:', err)
    });

    this.profileService.getCount(uid, 'lists').pipe(take(1)).subscribe({
      next: (count) => { this.countLists.set(count); this.loadingCountLists.set(false); }
    });

    this.profileService.getCount(uid, 'wishlist').pipe(take(1)).subscribe({
      next: (count) => { this.countWishlist.set(count); this.loadingCountWishlist.set(false); }
    });
  }

  setupRealtimeSocialData(uid: string): void {
    if (!uid) return;

    if (this.followersSubscription) this.followersSubscription.unsubscribe();
    if (this.followingSubscription) this.followingSubscription.unsubscribe();

    this.followersSubscription = this.socialService.getFollowers(uid).subscribe({
      next: (followers) => this.followers.set(followers),
      error: (err) => console.error('Erro ao escutar seguidores:', err)
    });

    this.followingSubscription = this.socialService.getFollowing(uid).subscribe({
      next: (following) => this.following.set(following),
      error: (err) => console.error('Erro ao escutar seguindo:', err)
    });
  }

  followUser(): void {
    const targetUserId = this.userData()?.uid;
    if (!targetUserId) return;

    this.socialService.followUser(targetUserId).pipe(take(1)).subscribe({
      next: () => console.log(`Sucesso ao seguir ${targetUserId}`),
      error: (err) => console.error('Erro ao seguir usuário:', err)
    });
  }

  unfollowUser(): void {
    const targetUserId = this.userData()?.uid;
    if (!targetUserId) return;

    this.socialService.unfollowUser(targetUserId).pipe(take(1)).subscribe({
      next: () => console.log(`Sucesso ao deixar de seguir ${targetUserId}`),
      error: (err) => console.error('Erro ao deixar de seguir usuário:', err)
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}