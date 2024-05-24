import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatIconModule, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  query!: string;
  result: any = [];

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private route: Router,
    private auth: AuthService
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

  checkToken() {
    return this.auth.isTokenExpired();
  }

  signOut() {
    this.auth.deleteToken();
  }
}
