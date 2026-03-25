import { Component, inject, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IconComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  private router = inject(Router);

  protected menu = signal([
    {title: 'Search', icon: 'search', path: '/search'},
    {title: 'Collections', icon: 'collections', path: '/coll'},
    {title: 'Wishlist', icon: 'wishlist', path: '/wishlist'},
    {title: 'Profile', icon: 'profile', path: '/profile'},
  ])

}
