import { Component, inject } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { IMovieSearch } from '../../../shared/models/IMovies';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent {

  private moviesService = inject(MoviesService);
  private searchSubject = new Subject<string>();

  protected results$ = this.searchSubject.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(term => {
      if (!term.trim()) return of({ Response: false, Search: [], totalResults: '0' });
      return this.moviesService.searchMovies(term);
    })
  );

  searchMovies(search: string) {
    this.searchSubject.next(search);
  }

}
