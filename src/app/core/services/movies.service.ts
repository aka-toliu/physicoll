import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMovieDetail, IMovieSearch } from '../../shared/models/IMovies';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private http = inject(HttpClient);
  private apiURL = 'https://www.omdbapi.com/?apikey=272d0164'
  

  constructor() { }

  searchMovies(search: string): Observable<IMovieSearch> {
    return this.http.get<IMovieSearch>(`${this.apiURL}&s=${search}`);
  }

  getMovie(id: string) {
    return this.http.get<IMovieDetail>(`${this.apiURL}&i=${id}`);
  }

}
