import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { AuthService } from '../../services/auth.service';

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

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  addBookHandler(book: any) {
    const userId = this.auth.getUserId();
    const token = this.auth.getToken();

    if (userId && token) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'user-id': `${userId}`,
        }),
      };

      const data = {
        book,
        userId,
      };

      this.http
        .post('http://localhost:3000/library/books', data, httpOptions)
        .subscribe((data) => {
          console.log(data);
        });
    }
    return;
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
