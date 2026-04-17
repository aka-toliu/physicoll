import { Component, inject, OnInit, signal } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IItem, IMovieDetail } from '../../../shared/models/IMovies';
import { CommonModule, NgStyle } from '@angular/common';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ECaseState, EDiscState, EFormat, EResolution, ETapeState, EVHSCase } from '../../../shared/models/EItem';
import { NgxMaskDirective } from 'ngx-mask';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CollectionService } from '../../../core/services/collection.service';
import { CollFormComponent } from '../../../shared/components/coll-form/coll-form.component';



@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NgStyle, CommonModule, ReactiveFormsModule, NgxMaskDirective, IconComponent, CollFormComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private moviesService = inject(MoviesService);
 

  protected loading = false;
  protected movie = signal<IMovieDetail | null>(null);

  public modalAddToCollection = signal(false);
  
  ngOnInit(): void {
    this.onGetMovieDetails();
  }


  onGetMovieDetails() {
      this.activatedRoute.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId) {
        this.moviesService.getMovie(movieId).subscribe({
          next: (movie) => {
            this.movie.set(movie);
            this.loading = false;
          },
          error: (err) => {
            console.error('Error:', err);
          }
        });
      }
    });
  }

  onBack() {
    this.router.navigate(['/search']);
  }


}
