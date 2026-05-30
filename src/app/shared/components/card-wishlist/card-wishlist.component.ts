import { Component, inject, input, output } from '@angular/core';
import { IWishlistItem } from '../../models/IWishlist';
import { Router } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-card-wishlist',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './card-wishlist.component.html',
  styleUrl: './card-wishlist.component.scss',
  host: {
    '(click)': 'navigateTo(wishlistItem().imdbID)',
  }
})
export class CardWishlistComponent {

  public wishlistItem = input.required<IWishlistItem>();

  private router = inject(Router);
  private wishlistService = inject(WishlistService);
  deleteWishlistItem = output<boolean>();

  navigateTo(imdbID: string) {
    this.router.navigate(['/movie', imdbID]);
  }

  removeFromWishlist(event: Event) {
    event.stopPropagation();
    const uid = localStorage.getItem('UID');
    if (uid) {
      this.wishlistService.removeFromWishlist(uid, this.wishlistItem().imdbID).subscribe({
        next: () => {
          console.log('Item removido da wishlist');
          this.deleteWishlistItem.emit(true);
        },
        error: (err) => {
          console.error('Erro ao remover item da wishlist:', err);
        }
      });
    }
  }

}
