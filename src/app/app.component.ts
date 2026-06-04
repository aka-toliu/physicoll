import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, RoutesRecognized } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'physicoll';

  private router = inject(Router);

  protected showFooter = signal(false);

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        let currentRoute = event.state.root.firstChild;
        this.showFooter.set(currentRoute?.data['footer'] !== false);
      }
    })
  }

}
