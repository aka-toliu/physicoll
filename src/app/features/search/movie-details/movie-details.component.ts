import { Component, inject, OnInit, signal } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IItem, IMovieDetail, IMovieResult, IMovieTrack } from '../../../shared/models/IMovies';
import { CommonModule, Location, NgStyle } from '@angular/common';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ECaseState, EDiscState, EFormat, EResolution, ETapeState, EVHSCase } from '../../../shared/models/EItem';
import { NgxMaskDirective } from 'ngx-mask';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CollectionService } from '../../../core/services/collection.service';
import { CollFormComponent } from '../../../shared/components/coll-form/coll-form.component';
import { WishlistService } from '../../../core/services/wishlist.service';
import { TrackMoviesService } from '../../../core/services/track-movies.service';



@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NgStyle, CommonModule, ReactiveFormsModule, NgxMaskDirective, IconComponent, CollFormComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private moviesService = inject(MoviesService);
  private wishlistService = inject(WishlistService);
  private trackMoviesService = inject(TrackMoviesService);
  private location = inject(Location);


  protected loading = false;
  protected inWishlist = false;
  protected movie = signal<IMovieDetail | null>(null);

  public modalAddToCollection = signal(false);

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
            this.verificarWishlist(movie.imdbID);
          },
          error: (err) => {
            console.error('Error:', err);
          }
        });
      }
    });
  }

  verificarWishlist(imdbID: string) {
    const uid = localStorage.getItem('UID');
    this.wishlistService.verifyInWishlist(uid!, imdbID).subscribe({
      next: (exists) => {
        console.log('Item na wishlist:', exists);
        this.inWishlist = exists;
      },
      error: (err) => {
        console.error('Erro ao verificar item na wishlist:', err);
      }
    });
  }

  toggleWishlist() {
    const uid = localStorage.getItem('UID');

    if (!this.inWishlist) {
      const item = {
        imdbID: this.movie()!.imdbID,
        title: this.movie()!.Title,
        year: this.movie()!.Year,
        poster: this.movie()!.Poster,
        addedAt: new Date()
      };
      this.wishlistService.addToWishlist(uid!, item).subscribe({
        next: () => {
          this.inWishlist = true;
          this.addCount(this.movie());
        },
        error: (err) => {
          console.error('Erro ao adicionar item à wishlist:', err);
        }
      });
    } else {
      this.wishlistService.removeFromWishlist(uid!, this.movie()!.imdbID).subscribe({
        next: () => {
          this.inWishlist = false;
          this.removeCount(this.movie());
        },
        error: (err) => {
          console.error('Erro ao remover item da wishlist:', err);
        }
      });
    }
  }

  addCount(movie: IMovieResult | null) {

    const movieTrack = {
      poster: movie?.Poster,
      imdbID: movie?.imdbID,
      title: movie?.Title
    }

    this.trackMoviesService.addCountMovieWished(movieTrack as IMovieTrack).subscribe({
      next: () => {
        console.log('Contagem de busca atualizada com sucesso');
      },
      error: (err) => {
        console.error('Erro ao atualizar contagem de busca:', err);
      }
    });
  }

  removeCount(movie: IMovieResult | null) {

    const movieTrack = {
      poster: movie?.Poster,
      imdbID: movie?.imdbID,
      title: movie?.Title
    }

    this.trackMoviesService.removeCountMovieWished(movieTrack as IMovieTrack).subscribe({
      next: () => {
        console.log('Contagem de favoritos atualizada com sucesso');
      },
      error: (err) => {
        console.error('Erro ao atualizar contagem de busca:', err);
      }
    });
  }

  onBack() {
    this.location.back();
  }


}
