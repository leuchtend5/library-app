import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  books: any = [];
  totalBooks: number = 0;
  page: number = 1;
  limit: number = 8;
  paginatedBooks: any = [];
  isLibraryAvailable: boolean = false;

  constructor(
    private route: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const checkToken = this.auth.isTokenExpired();
    if (checkToken) {
      this.auth.deleteToken();
      this.route.navigate(['/login']);
    }

    this.fetchLibraryData();
  }

  fetchLibraryData() {
    const token = this.auth.getToken();
    const userId = this.auth.getUserId();

    if (token && userId) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'user-id': `${userId}`,
        }),
      };

      this.http
        .get<{ userId: string }>('http://localhost:3000/library', httpOptions)
        .subscribe({
          next: (data) => {
            this.books = data;
            this.totalBooks = this.books.length;
            this.isLibraryAvailable = true;
            this.paginateBooks();
          },
          error: (err) => {
            console.log(err);
            this.isLibraryAvailable = false;
          },
        });
    } else {
      console.error('No token found');
    }
  }

  deleteBookHandler(book: any) {
    const userId = this.auth.getUserId();
    const token = this.auth.getToken();

    if (userId && token) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'user-id': `${userId}`,
          'book-id': `${book.id}`,
        }),
      };

      this.http
        .delete('http://localhost:3000/library/books', httpOptions)
        .subscribe((data) => {
          console.log(data);
          this.fetchLibraryData();
        });
    }
    return;
  }

  editBookHandler(book: any) {
    const userId = this.auth.getUserId();
    const token = this.auth.getToken();

    if (userId && token) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      };

      const data = {
        userId,
        bookId: book.id,
      };

      this.http
        .put<{ isRead: boolean }>(
          'http://localhost:3000/library/books',
          data,
          httpOptions
        )
        .subscribe((data) => {
          book.isRead = data.isRead;
          this.fetchLibraryData();
        });
    }
    return;
  }

  createLibrary() {
    const userId = this.auth.getUserId();
    const token = this.auth.getToken();

    if (userId && token) {
      const userData = {
        userId: userId,
      };

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'user-id': `${userId}`,
        }),
      };

      this.http
        .post('http://localhost:3000/library', userData, httpOptions)
        .subscribe((data) => {
          this.isLibraryAvailable = true;
          console.log(data);
        });
    }
  }

  paginateBooks() {
    const startIndex = (this.page - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    this.paginatedBooks = this.books.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.page * this.limit < this.totalBooks) {
      this.page++;
      this.paginateBooks();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.paginateBooks();
    }
  }
}
