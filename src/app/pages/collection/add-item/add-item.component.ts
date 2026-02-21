import { Component, computed, inject, signal } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { IMovieDetail, IMovieSearch } from '../../../shared/models/IMovies';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError, finalize, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent {

  private moviesService = inject(MoviesService);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  isSearchLoading = signal<boolean>(false);

  protected movieSelected = signal<IMovieDetail | null>(null);

  protected results = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) return of({ Response: false, Search: [], totalResults: null });
        this.isSearchLoading.set(true);
        return this.moviesService.searchMovies(term).pipe(
          catchError(() =>
            of({ Response: false, Search: [], totalResults: null, error: 'Erro ao buscar filmes' })
          ),
          finalize(() => this.isSearchLoading.set(false))
        );
      }),
      catchError(() =>
        of({ Response: false, Search: [], totalResults: null, error: 'Erro ao buscar filmes' })
      )
    ),
    { initialValue: null }
  );

  searchMovies(search: string) {
    this.searchTerm.set(search);
  }

  selectMovie(imdbID: string) {
    this.isLoading.set(true);
    this.searchTerm.set('');
    this.moviesService.getMovie(imdbID).subscribe({
      next: 
      (movie) => {
        this.movieSelected.set(movie);
        this.isLoading.set(false);
      },
      error: () => {
        this.movieSelected.set(null);
        this.isLoading.set(false);
      }
    });
  }

}
