import { Component, computed, inject, signal } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { IMovieSearch } from '../../../shared/models/IMovies';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs';
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

  protected results = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) return of({ Response: 'false', Search: [], totalResults: '0' });
        return this.moviesService.searchMovies(term);
      })
    ),
    { initialValue: { Response: 'false', Search: [], totalResults: '0' } }
  );

  searchMovies(search: string) {
    this.searchTerm.set(search);
  }

}
