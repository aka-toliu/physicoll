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
    {title: 'Buscar', icon: 'search', path: '/search'},
    {title: 'Coleção', icon: 'collections', path: '/coll'},
    {title: 'Salvos', icon: 'wishlist', path: '/wishlist'},
    {title: 'Perfil', icon: 'profile', path: '/profile'},
  ])

}
