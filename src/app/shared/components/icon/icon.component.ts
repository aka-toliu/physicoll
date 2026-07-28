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
  size = input<number>(32);
  colorVar = input<string>('primary-color');
  colorHex = input<string>('#000000');
}
