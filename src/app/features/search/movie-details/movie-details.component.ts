import { Component, inject, OnInit, signal } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { IMovieDetail } from '../../../shared/models/IMovies';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  
  private activatedRoute = inject(ActivatedRoute);
  private moviesService = inject(MoviesService);

  protected loading = false;
  protected movie = signal<IMovieDetail | null>(null);
  
  ngOnInit(): void {
    this.onGetMovieDetails();
  }

  onGetMovieDetails() {
      this.activatedRoute.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId) {
        this.moviesService.getMovie(movieId).subscribe({
          next: (movie) => {
            this.movie.set(movie);
            this.loading = false;
          },
          error: (err) => {
            console.error('Error:', err);
          }
        });
      }
    });
  }


}
