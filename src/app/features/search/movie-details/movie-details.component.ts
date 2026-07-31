import { Component, inject, OnInit, signal } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITMDBMovieDetail, IMovieTrack } from '../../../shared/models/IMovies';
import { CommonModule, Location, NgStyle } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CollFormComponent } from '../../../shared/components/coll-form/coll-form.component';
import { WishlistService } from '../../../core/services/wishlist.service';
import { TrackMoviesService } from '../../../core/services/track-movies.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NgStyle, CommonModule, ReactiveFormsModule, NgxMaskDirective, IconComponent, CollFormComponent, ModalComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public moviesService = inject(MoviesService);
  private wishlistService = inject(WishlistService);
  private trackMoviesService = inject(TrackMoviesService);
  private location = inject(Location);

  protected loading = signal<boolean>(true);
  protected inWishlist = signal<boolean>(false);
  protected movie = signal<ITMDBMovieDetail | null>(null);

  protected plotExtended = signal<boolean>(false);
  protected showFullCastModal = signal<boolean>(false);
  public modalAddToCollection = signal<boolean>(false);

  ngOnInit(): void {
    this.onGetMovieDetails();
  }

  onGetMovieDetails(): void {
    this.activatedRoute.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId) {
        this.loading.set(true);
        this.moviesService.getMovie(movieId).subscribe({
          next: (movie) => {
            this.movie.set(movie);
            this.loading.set(false);
            const idToVerify = movie.imdb_id || movie.id.toString();
            this.verificarWishlist(idToVerify);
            console.log('Movie Details:', movie);

          },
          error: (err) => {
            console.error('Erro ao carregar detalhes do filme:', err);
            this.loading.set(false);
          }
        });
      }
    });
  }

  verificarWishlist(id: string): void {
    const uid = localStorage.getItem('UID');
    if (!uid) return;

    this.wishlistService.verifyInWishlist(uid, id).subscribe({
      next: (exists) => {
        this.inWishlist.set(exists);
      },
      error: (err) => {
        console.error('Erro ao verificar item na wishlist:', err);
      }
    });
  }

  toggleWishlist(): void {
    const uid = localStorage.getItem('UID');
    const movieData = this.movie();

    if (!uid || !movieData) return;

    const movieIdentifier = movieData.imdb_id || movieData.id.toString();

    if (!this.inWishlist()) {
      const item = {
        tmdbID: movieData.id,
        imdbID: movieIdentifier,
        title: movieData.title,
        year: movieData.release_date ? movieData.release_date.split('-')[0] : 'N/A',
        poster: this.moviesService.getImageUrl(movieData.poster_path, 'w500'),
        addedAt: new Date()
      };

      this.wishlistService.addToWishlist(uid, item).subscribe({
        next: () => {
          this.inWishlist.set(true);
          this.addCount(movieData);
        },
        error: (err) => {
          console.error('Erro ao adicionar item à wishlist:', err);
        }
      });
    } else {
      this.wishlistService.removeFromWishlist(uid, movieIdentifier).subscribe({
        next: () => {
          this.inWishlist.set(false);
          this.removeCount(movieData);
        },
        error: (err) => {
          console.error('Erro ao remover item da wishlist:', err);
        }
      });
    }
  }

  getImageUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w500' | 'original' = 'w500'): string {
    return this.moviesService.getImageUrl(path, size);
  }

  addCount(movie: ITMDBMovieDetail | null): void {
    if (!movie) return;

    const movieTrack: IMovieTrack = {
      tmdbID: movie.id,
      imdbID: movie.imdb_id || movie.id.toString(),
      title: movie.title,
      poster: this.moviesService.getImageUrl(movie.poster_path, 'w500'),
      searchCount: 0,
      collectedCount: 0,
      wishedCount: 1
    };

    this.trackMoviesService.addCountMovieWished(movieTrack).subscribe({
      next: () => console.log('Contagem de wishlist atualizada com sucesso'),
      error: (err) => console.error('Erro ao atualizar contagem de wishlist:', err)
    });
  }

  removeCount(movie: ITMDBMovieDetail | null): void {
    if (!movie) return;

    const movieTrack: IMovieTrack = {
      tmdbID: movie.id,
      imdbID: movie.imdb_id || movie.id.toString(),
      title: movie.title,
      poster: this.moviesService.getImageUrl(movie.poster_path, 'w500'),
      searchCount: 0,
      collectedCount: 0,
      wishedCount: 1
    };

    this.trackMoviesService.removeCountMovieWished(movieTrack).subscribe({
      next: () => console.log('Contagem de wishlist decrementada com sucesso'),
      error: (err) => console.error('Erro ao decrementar contagem de wishlist:', err)
    });
  }

  onBack(): void {
    this.location.back();
  }
}