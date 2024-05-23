import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { SharedService } from '../../services/shared.service';

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
    private route: ActivatedRoute
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
