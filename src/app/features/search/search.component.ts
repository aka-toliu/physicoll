import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError, finalize } from 'rxjs';
import { MoviesService } from '../../core/services/movies.service';
import { IMovieDetail, IMovieResult, IMovieTrack } from '../../shared/models/IMovies';
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


  private moviesService = inject(MoviesService);
  private trackMoviesService = inject(TrackMoviesService);
  private router = inject(Router);


  protected searchTerm = signal<string>('');
  protected isSearchLoading = signal<boolean>(false);
  protected movieSelected = signal<IMovieDetail | null>(null);

  protected mostSearched = signal(<any>[]);
  protected mostCollected = signal(<any>[]);
  protected mostWished = signal(<any>[]);

  ngOnInit(): void {
    this.getTopSearched();
    this.getTopCollected();
    this.getTopWished();
  }

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

  selectMovie(movie: IMovieResult) {
    this.addCount(movie)
    this.router.navigate(['/movie', movie.imdbID]);
  }

  getTopSearched() {
    this.trackMoviesService.getTopSearchedMovies().subscribe({
      next: (list) => {
        this.mostSearched.set(list);
        console.log('Top filmes buscados carregados:', list);
      },
      error: (err) => {
        console.error('Erro ao buscar o ranking no componente:', err);
      }
    });
  }

  getTopCollected() {
    this.trackMoviesService.getTopCollectedMovies().subscribe({
      next: (list) => {
        this.mostCollected.set(list);
        console.log('Top filmes buscados carregados:', list);
      },
      error: (err) => {
        console.error('Erro ao buscar o ranking no componente:', err);
      }
    });
  }

    getTopWished() {
    this.trackMoviesService.getTopWishedMovies().subscribe({
      next: (list) => {
        this.mostWished.set(list);
        console.log('Top filmes buscados carregados:', list);
      },
      error: (err) => {
        console.error('Erro ao buscar o ranking no componente:', err);
      }
    });
  }

  addCount(movie: IMovieResult) {

    const movieTrack = {
      poster: movie.Poster,
      imdbID: movie.imdbID,
      title: movie.Title
    }

    this.trackMoviesService.addCountMovieSearched(movieTrack as IMovieTrack).subscribe({
      next: () => {
        console.log('Contagem de busca atualizada com sucesso');
      },
      error: (err) => {
        console.error('Erro ao atualizar contagem de busca:', err);
      }
    });
  }

}
