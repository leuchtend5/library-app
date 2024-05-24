import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchData: any = [];

  setSearchData(data: any) {
    this.searchData = data;
  }

  getSearchData() {
    return this.searchData;
  }
}
