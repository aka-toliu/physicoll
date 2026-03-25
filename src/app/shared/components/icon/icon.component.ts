import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {

  icon = input.required<string>();
  color = input<string>('primary-color');

  ngOnInit(): void {
    console.log(this.icon());
  }

}
