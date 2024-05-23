import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchData: any = [];
  // private searchDataSubject = new BehaviorSubject<any[]>([]);
  // searchData$ = this.searchDataSubject.asObservable();

  setSearchData(data: any) {
    this.searchData = data;
  }

  getSearchData() {
    return this.searchData;
  }
}
