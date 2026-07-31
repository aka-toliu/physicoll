import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError, finalize } from 'rxjs';
import { MoviesService } from '../../core/services/movies.service';
import { ITMDBMovieSearchResult, IMovieTrack } from '../../shared/models/IMovies';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TrackMoviesService } from '../../core/services/track-movies.service';
import { CardMovieComponent } from '../../shared/components/card-movie/card-movie.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [IconComponent, CardMovieComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  protected moviesService = inject(MoviesService);
  private trackMoviesService = inject(TrackMoviesService);
  private router = inject(Router);

  protected searchTerm = signal<string>('');
  protected isSearchLoading = signal<boolean>(false);

  protected mostSearched = signal<IMovieTrack[]>([]);
  protected mostCollected = signal<IMovieTrack[]>([]);
  protected mostWished = signal<IMovieTrack[]>([]);

  ngOnInit(): void {
    this.getTopSearched();
    this.getTopCollected();
    this.getTopWished();
  }

  // toSignal gerenciando a busca dinâmica pelo TMDB
  protected results = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) return of({ page: 1, results: [], total_results: 0, total_pages: 0 });
        
        this.isSearchLoading.set(true);
        
        return this.moviesService.searchMovies(term).pipe(
          catchError(() =>
            of({ page: 1, results: [], total_results: 0, total_pages: 0, error: 'Erro ao buscar filmes' })
          ),
          finalize(() => this.isSearchLoading.set(false))
        );
      }),
      catchError(() =>
        of({ page: 1, results: [], total_results: 0, total_pages: 0, error: 'Erro ao buscar filmes' })
      )
    ),
    { initialValue: null }
  );

  searchMovies(search: string): void {
    this.searchTerm.set(search);
  }

  selectMovie(movie: ITMDBMovieSearchResult): void {
    this.addCount(movie);
    // Agora navegamos passando o ID numérico nativo do TMDB
    this.router.navigate(['/movie', movie.id]);
  }

  getTopSearched(): void {
    this.trackMoviesService.getTopSearchedMovies().subscribe({
      next: (list) => this.mostSearched.set(list),
      error: (err) => console.error('Erro ao buscar o ranking de mais pesquisados:', err)
    });
  }

  getTopCollected(): void {
    this.trackMoviesService.getTopCollectedMovies().subscribe({
      next: (list) => this.mostCollected.set(list),
      error: (err) => console.error('Erro ao buscar o ranking de colecionados:', err)
    });
  }

  getTopWished(): void {
    this.trackMoviesService.getTopWishedMovies().subscribe({
      next: (list) => this.mostWished.set(list),
      error: (err) => console.error('Erro ao buscar o ranking de desejados:', err)
    });
  }

  addCount(movie: ITMDBMovieSearchResult): void {
    const movieTrack: IMovieTrack = {
      tmdbID: movie.id,
      imdbID: movie.id.toString(), // Mapeia o id para string pra garantir compatibilidade com o Firestore
      title: movie.title,
      poster: this.moviesService.getImageUrl(movie.poster_path, 'w500'),
      searchCount: 1,
      collectedCount: 0,
      wishedCount: 0
    };

    this.trackMoviesService.addCountMovieSearched(movieTrack).subscribe({
      next: () => console.log('Contagem de busca atualizada com sucesso'),
      error: (err) => console.error('Erro ao atualizar contagem de busca:', err)
    });
  }

}