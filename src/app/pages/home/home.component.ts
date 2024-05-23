import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  books: any = [];
  page: number = 1;
  limit: number = 8;
  totalBooks: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.http
      .get<{ books: any; totalBooks: number }>(
        `http://localhost:3000/api/books?page=${this.page}&limit=${this.limit}`
      )
      .subscribe((data) => {
        this.books = data.books;
        this.totalBooks = data.totalBooks;
      });
  }

  nextPage() {
    if (this.page * this.limit < this.totalBooks) {
      this.page++;
      this.fetchData();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchData();
    }
  }
}
