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
    '[class.card-coll--grid]': "viewMode() === 'grid'",
    '[class.card-coll--list]': "viewMode() === 'list'"
  }
})
export class CardCollComponent {

  item = input.required<ICollectionItem | null>();
  viewMode = input<'grid' | 'list'>('list');

  private route = inject(Router);

  navigateTo(id: string) {
    this.route.navigate(['coll/', id]);
  }

}
