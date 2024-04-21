import { Component, OnInit } from '@angular/core';
import { AdminService } from "../../../../core/services/admin/admin.service"
import { BehaviorSubject, Observable, combineLatest, last, map, switchMap } from 'rxjs';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users$: Observable<IEEEuser[]>;
  count: number;
  cursor: IEEEuser[] = [];

  searchbarTimeout: number;
  searchword$: BehaviorSubject<string> = new BehaviorSubject(null);

  roles: string[] = [null, "Admin", "Escritor"]
  colors: string[] = [null, "primary", "accent"]

  userPage$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  userPageSize$: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  
  constructor(private adminService: AdminService) {
    adminService.setCollectionName('users');
  }

  setPageSize(size: number) {
    this.userPage$.next(1);
    this.userPageSize$.next(size);
    this.firstPage();
  }

  hasNextPage(): boolean {
    let pageCount = Math.floor((this.count - 1) / this.userPageSize$.getValue()) + 1;
    return this.userPage$.getValue() < pageCount || !this.cursor[1];
  }

  hasPrevPage(): boolean {
    return this.userPage$.getValue() > 1 || !this.cursor[0];
  }
  
  nextPage() {
    if (!this.hasNextPage()) return;
    this.users$ = this.adminService.getUsersNextPage(this.cursor[1], this.userPageSize$.getValue(), this.searchword$.getValue());
    this.setCursor();
    this.userPage$.next(this.userPage$.getValue() + 1);
  }

  prevPage() {
    if (!this.hasPrevPage()) return;
    this.users$ = this.adminService.getUsersPrevPage(this.cursor[0], this.userPageSize$.getValue(), this.searchword$.getValue());
    this.setCursor();
    this.userPage$.next(this.userPage$.getValue() - 1);
  }

  firstPage() {
    this.users$ = this.adminService.getUsersFirstPage(this.userPageSize$.getValue(), this.searchword$.getValue());
    this.setCursor();
  }

  setCursor() {
    this.users$.subscribe((users) => {
      this.cursor[0] = users[0];
      this.cursor[1] = users[users.length - 1];
    })
  }

  handlePageEvent(e: PageEvent) {
    if (e.pageIndex > e.previousPageIndex) this.nextPage();
    if (e.pageIndex < e.previousPageIndex) this.prevPage();
    if (e.pageSize != this.userPageSize$.getValue()) this.setPageSize(e.pageSize);
  }

  handleInputEvent(e: any) {
    if (this.searchbarTimeout) clearTimeout(this.searchbarTimeout);
    this.searchbarTimeout = setTimeout(() => {
      if (e.target.value == this.searchword$.getValue()) return;
      if (e.target.value.trim() == "") this.searchword$.next(null);
      else this.searchword$.next(e.target.value);
      this.userPage$.next(1);
      this.firstPage();
      this.getCount();
    }, 1000);
  }

  getCount() {
    let count$: Observable<number>;
    if (!this.searchword$.getValue()) count$ = this.adminService.getTotalCount();
    else count$ = this.adminService.getSearchCount(this.searchword$.getValue());
    count$.subscribe(count => {
      this.count = count;
    })
  }

  ngOnInit(): void {
    this.firstPage();
    this.getCount();
  }

}
