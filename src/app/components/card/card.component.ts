import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() imageSrc!: string;
  @Input() title!: string;
  @Input() author!: string;
  @Input() year!: string;
}
