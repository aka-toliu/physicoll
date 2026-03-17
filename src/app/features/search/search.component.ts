import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError, finalize } from 'rxjs';
import { MoviesService } from '../../core/services/movies.service';
import { IMovieDetail } from '../../shared/models/IMovies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {


  private moviesService = inject(MoviesService);
  private router = inject(Router);


  protected searchTerm = signal<string>('');
  protected isSearchLoading = signal<boolean>(false);
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

  selectMovie(id: string) {
    this.router.navigate(['/movie', id]);
  }

}
