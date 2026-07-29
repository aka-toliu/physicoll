import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { MoviesService } from '../../../core/services/movies.service';
import { ITMDBMovieDetail, ITMDBMovieSearchResponse } from '../../../shared/models/IMovies';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent {

  public moviesService = inject(MoviesService);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  isSearchLoading = signal<boolean>(false);

  protected movieSelected = signal<ITMDBMovieDetail | null>(null);

  protected results = toSignal<ITMDBMovieSearchResponse | null>(
    toObservable(this.searchTerm).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
          return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
        }

        this.isSearchLoading.set(true);
        return this.moviesService.searchMovies(term).pipe(
          catchError(() =>
            of({ page: 1, results: [], total_pages: 0, total_results: 0 })
          ),
          finalize(() => this.isSearchLoading.set(false))
        );
      }),
      catchError(() =>
        of({ page: 1, results: [], total_pages: 0, total_results: 0 })
      )
    ),
    { initialValue: null }
  );

  searchMovies(search: string) {
    this.searchTerm.set(search);
  }

  selectMovie(id: number) {
    this.isLoading.set(true);
    this.searchTerm.set('');
    
    this.moviesService.getMovie(id).subscribe({
      next: (movie) => {
        this.movieSelected.set(movie);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do filme no TMDB:', err);
        this.movieSelected.set(null);
        this.isLoading.set(false);
      }
    });
  }
}