import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../../core/services/movies.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private moviesService = inject(MoviesService);

  ngOnInit(): void {
    this.moviesService.searchMovies('chico bento').subscribe((response) => {
      console.log(response);
    });
  }

}
