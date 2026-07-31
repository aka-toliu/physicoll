import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITMDBMovieSearchResponse, ITMDBMovieDetail } from '../../shared/models/IMovies';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private http = inject(HttpClient);

  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly defaultLanguage = 'pt-BR';


  constructor() { }

  searchMovies(query: string, page: number = 1): Observable<ITMDBMovieSearchResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query)
      .set('language', this.defaultLanguage)
      .set('page', page.toString())
      .set('include_adult', 'false');

    return this.http.get<ITMDBMovieSearchResponse>(`${this.baseUrl}/search/movie`, { params });
  }

  getMovie(id: number | string): Observable<ITMDBMovieDetail> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', this.defaultLanguage)
      .set('append_to_response', 'credits,videos,images');

    return this.http.get<ITMDBMovieDetail>(`${this.baseUrl}/movie/${id}`, { params });
  }

  
  getImageUrl(path: string | null, size:'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) {
      return 'assets/images/no-poster.png';
    }
    return `${environment.tmdbImageBaseUrl}/${size}${path}`;
  }

}
