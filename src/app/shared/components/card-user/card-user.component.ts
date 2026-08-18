import { Component, inject, input } from '@angular/core';
import { ProfileService } from '../../../core/services/profile.service';
import { IProfile } from '../../models/IProfile';
import { switchMap } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-user',
  standalone: true,
  imports: [],
  templateUrl: './card-user.component.html',
  styleUrl: './card-user.component.scss',
  host: {
    "(click)": "navigateToProfile()"
  }
})
export class CardUserComponent {

  public uid = input.required<string>();
  private profileService = inject(ProfileService);
  private router = inject(Router);

  protected userData = toSignal(
    toObservable(this.uid).pipe(
      switchMap(id => this.profileService.getProfile(id))
    )
  );

  navigateToProfile() {
    this.router.navigate(['/profile', this.userData()?.username]);
  }

}
