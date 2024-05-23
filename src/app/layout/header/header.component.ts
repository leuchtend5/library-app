import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatIconModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  query!: string;
  result: any = [];

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private route: Router
  ) {}

  searchData() {
    if (this.query !== '') {
      this.http
        .get<{ books: any }>(`http://localhost:3000/search?query=${this.query}`)
        .subscribe((data) => {
          this.result = data.books;
          this.sharedService.setSearchData(data.books);
          this.route.navigate(['/search'], {
            queryParams: { query: this.query },
          });
        });
    }
  }
}
