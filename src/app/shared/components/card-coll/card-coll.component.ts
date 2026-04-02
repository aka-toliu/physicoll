import { Component, inject, input } from '@angular/core';
import { ICollectionItem } from '../../models/ICollection';
import { NgClass, CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-card-coll',
  standalone: true,
  imports: [NgClass, CommonModule, IconComponent],
  templateUrl: './card-coll.component.html',
  styleUrl: './card-coll.component.scss',
  host: {
    '(click)': 'navigateTo(item()?.id!)',
  }
})
export class CardCollComponent {

  item = input.required<ICollectionItem | null>();

  private route = inject(Router);

  navigateTo(id: string){
    this.route.navigate(['coll/', id]);    
  }

}
