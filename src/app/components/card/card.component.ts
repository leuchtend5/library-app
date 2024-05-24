import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() imageSrc!: string;
  @Input() title!: string;
  @Input() author!: string;
  @Input() year!: string;
  @Input() book!: any;
  @Input() status!: boolean;
  @Input() isInLibrary!: boolean;
  @Output() addToLibrary: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteFromLibrary: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() editBookStatusFromLibrary: EventEmitter<string> =
    new EventEmitter<string>();

  postBookToLibrary(book: any) {
    this.addToLibrary.emit(book);
  }

  deleteBookToLibrary(book: any) {
    this.deleteFromLibrary.emit(book);
  }

  editBookStatus(book: any) {
    this.editBookStatusFromLibrary.emit(book);
  }
}
