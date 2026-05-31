import { Component, inject, input, OnInit } from '@angular/core';
import { IMovieTrack } from '../../models/IMovies';
import { Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-card-movie',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './card-movie.component.html',
  styleUrl: './card-movie.component.scss',
  host: {
    '(click)': 'navigateToMovie()'
  }
})
export class CardMovieComponent implements OnInit {
  
  private router = inject(Router);
  public movie = input<IMovieTrack>();
  public ranking = input<number>();
  public count = input<number>();
  public type = input<string>();
  
  navigateToMovie(){
    this.router.navigate(['/movie', this.movie()?.imdbID]);
  }
  
  ngOnInit(): void {
    
  }
}
