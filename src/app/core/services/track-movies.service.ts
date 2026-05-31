import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, increment, limit, orderBy, query, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { IMovieDetail, IMovieTrack } from '../../shared/models/IMovies';

@Injectable({
  providedIn: 'root'
})
export class TrackMoviesService {

  constructor() { }

  private firestore = inject(Firestore);

  addCountMovieSearched(movie: IMovieTrack): Observable<void> {
    const movieRef = doc(this.firestore, 'public/movie-stats');
    const promise = setDoc(movieRef, {
      [movie.imdbID]: {
        title: movie.title,
        poster: movie.poster,
        imdbID: movie.imdbID,
        searchCount: increment(1)
      }
    }, { merge: true });
    return from(promise);
  }

  addCountMovieCollected(movie: IMovieTrack): Observable<void> {
    const movieRef = doc(this.firestore, 'public/movie-stats');
    const promise = setDoc(movieRef, {
      [movie.imdbID]: {
        title: movie.title,
        poster: movie.poster,
        imdbID: movie.imdbID,
        collectedCount: increment(1)
      }
    }, { merge: true });

    return from(promise);
  }

  removeCountMovieCollected(movie: IMovieTrack): Observable<void> {
    const movieRef = doc(this.firestore, 'public/movie-stats');
    const promise = setDoc(movieRef, {
      [movie.imdbID]: {
        title: movie.title,
        poster: movie.poster,
        imdbID: movie.imdbID,
        collectedCount: increment(-1)
      }
    }, { merge: true });
    return from(promise);
  }

  addCountMovieWished(movie: IMovieTrack): Observable<void> {
    const movieRef = doc(this.firestore, 'public/movie-stats');
    const promise = setDoc(movieRef, {
      [movie.imdbID]: {
        title: movie.title,
        poster: movie.poster,
        imdbID: movie.imdbID,
        wishedCount: increment(1)
      }
    }, { merge: true });

    return from(promise);
  }

  removeCountMovieWished(movie: IMovieTrack): Observable<void> {
    const movieRef = doc(this.firestore, 'public/movie-stats');
    const promise = setDoc(movieRef, {
      [movie.imdbID]: {
        title: movie.title,
        poster: movie.poster,
        imdbID: movie.imdbID,
        wishedCount: increment(-1)
      }
    }, { merge: true });
    return from(promise);
  }

getTopSearchedMovies(): Observable<IMovieTrack[]> {
    const movieRef = doc(this.firestore, 'public/movie-stats');
    const promise = getDoc(movieRef).then(snapshot => {
      if (!snapshot.exists()) return [];
      const data = snapshot.data();
      if (!data) return [];
      
      const moviesArray = Object.values(data).filter(
        item => typeof item === 'object' && item !== null && 'searchCount' in item && item.searchCount > 0
      ) as IMovieTrack[];

      return moviesArray
        .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
        .slice(0, 10);
    });

    return from(promise);
  }

  getTopCollectedMovies(): Observable<IMovieTrack[]> {
    const movieRef = doc(this.firestore, 'public/movie-stats');
    const promise = getDoc(movieRef).then(snapshot => {
      if (!snapshot.exists()) return [];
      const data = snapshot.data();
      if (!data) return [];
      
      const moviesArray = Object.values(data).filter(
        item => typeof item === 'object' && item !== null && 'collectedCount' in item && item.collectedCount > 0
      ) as IMovieTrack[];

      return moviesArray
        .sort((a, b) => (b.collectedCount || 0) - (a.collectedCount || 0))
        .slice(0, 10);
    });

    return from(promise);
  }

  getTopWishedMovies(): Observable<IMovieTrack[]> {
    const movieRef = doc(this.firestore, 'public/movie-stats');
    const promise = getDoc(movieRef).then(snapshot => {
      if (!snapshot.exists()) return [];
      const data = snapshot.data();
      if (!data) return [];
      
      const moviesArray = Object.values(data).filter(
        item => typeof item === 'object' && item !== null && 'wishedCount' in item && item.wishedCount > 0
      ) as IMovieTrack[];

      return moviesArray
        .sort((a, b) => (b.wishedCount || 0) - (a.wishedCount || 0))
        .slice(0, 10);
    });

    return from(promise);
  }
}
