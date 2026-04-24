import { Component, inject, signal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { IWishlistItem } from '../../shared/models/IWishlist';
import { CardWishlistComponent } from '../../shared/components/card-wishlist/card-wishlist.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CardWishlistComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {

  private wishlistService = inject(WishlistService);

  protected wishlist = signal<IWishlistItem[]>([]);

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist() {
    const uid = localStorage.getItem('UID');
    this.wishlistService.getWishlist(uid!).subscribe({
      next: (wishlist) => {
        this.wishlist.set(wishlist);
        console.log('Wishlist:', wishlist);
      },
      error: (err) => {
        console.error('Error fetching wishlist:', err);
      }
    });
  }
}
