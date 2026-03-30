import { Component, input } from '@angular/core';
import { ICollectionItem } from '../../models/ICollection';
import { NgClass, CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';


@Component({
  selector: 'app-card-coll',
  standalone: true,
  imports: [NgClass, CommonModule, IconComponent],
  templateUrl: './card-coll.component.html',
  styleUrl: './card-coll.component.scss'
})
export class CardCollComponent {

  item = input.required<ICollectionItem>();

}
