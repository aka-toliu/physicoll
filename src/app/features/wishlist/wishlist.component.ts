import { Component, inject, signal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { IWishlistItem } from '../../shared/models/IWishlist';
import { CardWishlistComponent } from '../../shared/components/card-wishlist/card-wishlist.component';
import { Subscription } from 'rxjs';
import { IProfile } from '../../shared/models/IProfile';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CardWishlistComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {

  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private uid = signal(localStorage.getItem('UID'));
  public userData = signal<IProfile | null | undefined>(undefined);
  protected isMyself = signal(true);

  private routeSubscription!: Subscription;

  protected wishlist = signal<IWishlistItem[]>([]);

  ngOnInit(): void {
    this.onCheckProfile();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getWishlist(id: string): void {
    const userUid = id;
    if (!userUid) return;

    this.wishlistService.getWishlist(userUid).subscribe({
      next: (wishlist) => {
        this.wishlist.set(wishlist);
        console.log('Wishlist:', wishlist);
      },
      error: (err) => {
        console.error('Error fetching wishlist:', err);
      }
    });
  }

  onCheckProfile(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe({
      next: (params) => {
        const uid = params['userId'];
        if (uid) {
          this.onGetProfileByUsername(uid);
          console.log(uid);
        } else {
          this.isMyself.set(true);
          this.getWishlist(this.uid()!);
        }
      }
    });
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
    if (uid1 === uid2) {
      this.isMyself.set(true);
      this.getWishlist(this.userData()!.uid);
      console.log('Sou eu mesmo');
    } else {
      this.isMyself.set(false);
      this.getWishlist(this.userData()!.uid);
      console.log('Não sou eu');
    }
  }
}
