import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent implements OnInit {
  books: any = [];
  page: number = 1;
  limit: number = 8;
  totalBooks: number = 0;
  paginatedBooks: any = [];

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(() => {
      this.getData();
    });
  }

  getData() {
    this.books = this.sharedService.getSearchData();
    this.totalBooks = this.books.length;
    this.paginateBooks();
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
