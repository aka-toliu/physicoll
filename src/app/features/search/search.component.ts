import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError, finalize, combineLatest } from 'rxjs';
import { MoviesService } from '../../core/services/movies.service';
import { ITMDBMovieSearchResult, IMovieTrack } from '../../shared/models/IMovies';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TrackMoviesService } from '../../core/services/track-movies.service';
import { CardMovieComponent } from '../../shared/components/card-movie/card-movie.component';
import { SocialService } from '../../core/services/social.service';
import { IUser } from '../../shared/models/IProfile';

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
  private socialService = inject(SocialService);
  private router = inject(Router);

  protected searchTerm = signal<string>('');
  protected isSearchLoading = signal<boolean>(false);
  protected searchType = signal<'users' | 'movies'>('movies');
  protected userResults = signal<any[]>([])

  protected mostSearched = signal<IMovieTrack[]>([]);
  protected mostCollected = signal<IMovieTrack[]>([]);
  protected mostWished = signal<IMovieTrack[]>([]);

  ngOnInit(): void {
    this.getTopSearched();
    this.getTopCollected();
    this.getTopWished();
  }

  protected results = toSignal(
    combineLatest([
      toObservable(this.searchTerm),
      toObservable(this.searchType)
    ]).pipe(
      debounceTime(400),
      distinctUntilChanged(([prevTerm, prevType], [currTerm, currType]) =>
        prevTerm === currTerm && prevType === currType
      ),
      switchMap(([term, type]) => {
        const cleanTerm = term.trim();

        if (!cleanTerm) {
          this.userResults.set([]);
          return of({ page: 1, results: [], total_results: 0, total_pages: 0 });
        }

        this.isSearchLoading.set(true);

        // USUÁRIOS
        if (type === 'users') {
          return this.socialService.searchUsers(cleanTerm).pipe(
            switchMap((users) => {
              this.userResults.set(users);
              return of({ page: 1, results: [], total_results: 0, total_pages: 0 });
            }),
            catchError((err) => {
              console.error('Erro ao buscar usuários:', err);
              this.userResults.set([]);
              return of({ page: 1, results: [], total_results: 0, total_pages: 0, error: 'Erro ao buscar usuários' });
            }),
            finalize(() => this.isSearchLoading.set(false))
          );
        }

        // FILMES
        this.userResults.set([]); // Limpa resultados de usuários
        return this.moviesService.searchMovies(cleanTerm).pipe(
          catchError(() =>
            of({ page: 1, results: [], total_results: 0, total_pages: 0, error: 'Erro ao buscar filmes' })
          ),
          finalize(() => this.isSearchLoading.set(false))
        );
      })
    ),
    { initialValue: null }
  );

  searchMovies(search: string): void {
    this.searchTerm.set(search);
  }

  setSearchType(type: 'users' | 'movies' | string): void {
    this.searchType.set(type as 'users' | 'movies');
  }

  selectUser(user: IUser): void {
    this.router.navigate(['/profile', user.username]);
  }

  selectMovie(movie: ITMDBMovieSearchResult): void {
    this.addCount(movie);
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
      imdbID: movie.id.toString(),
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