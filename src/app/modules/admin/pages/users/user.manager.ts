import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map } from 'rxjs';
import { AdminService } from 'src/app/core/services/admin/admin.service';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import { IEEEUserFilters } from 'src/app/shared/models/ieee-user/ieee-user-filters';

@Injectable()
export class UserManagerService {
  private users$ = new BehaviorSubject<IEEEuser[]>([]);
  private userCount$ = new BehaviorSubject<number>(0);
  
  private startCursor$ = new BehaviorSubject<IEEEuser | null>(null);
  private endCursor$ = new BehaviorSubject<IEEEuser | null>(null);
  private filters$ = new BehaviorSubject<IEEEUserFilters | null>(null);

  private userPage$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private userPageSize$: BehaviorSubject<number> = new BehaviorSubject<number>(10);

  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly adminService: AdminService) {
    adminService.setCollectionName('users');
  }

  public pullUsers() {
    const filters = this.filters$.getValue();
    this.loading$.next(false);
    this.adminService.getUsersFirstPage(this.userPageSize$.getValue(), filters)
      .subscribe((users) => {
        this.users$.next(users);
        this.setCursors(users);
        this.pullUserCount();
        this.userPage$.next(1);
        this.loading$.next(true);
      });
  }

  private pullUserCount() {
    const filters = this.filters$.getValue();
    this.adminService.getTotalCount(filters).subscribe(count => {
      this.userCount$.next(count);
    })
  }
  
  public applyFilters(filters?: IEEEUserFilters) {
    this.filters$.next(filters || null);
    this.pullUsers();
  }

  private hasNextPage(): boolean {
    const userCount = this.userCount$.getValue();
    const endCursor = this.endCursor$.getValue();
    let pageCount = Math.floor((userCount - 1) / this.userPageSize$.getValue()) + 1;
    return this.userPage$.getValue() < pageCount || !endCursor;
  }

  private hasPrevPage(): boolean {
    const startCursor = this.startCursor$.getValue();
    return this.userPage$.getValue() >= 1 || !startCursor;
  }

  public pullNextPage() {
    if (!this.hasNextPage()) return;
    const endCursor = this.endCursor$.getValue();
    const pageSize = this.userPageSize$.getValue();
    const filters = this.filters$.getValue();
    this.loading$.next(true);
    this.adminService.getUsersNextPage(endCursor, pageSize, filters).subscribe(users => {
      let page = this.userPageSize$.getValue();
      this.users$.next(users);
      this.setCursors(users);
      this.userPageSize$.next(page++);
      this.loading$.next(false);
    });
  }

  public pullPrevPage() {
    if (!this.hasPrevPage()) return;
    const startCursor = this.startCursor$.getValue();
    const pageSize = this.userPageSize$.getValue();
    const filters = this.filters$.getValue();
    this.loading$.next(true);
    this.adminService.getUsersPrevPage(startCursor, pageSize, filters).subscribe(users => {
      let page = this.userPageSize$.getValue();
      this.users$.next(users);
      this.setCursors(users);
      this.userPageSize$.next(page--);
      this.loading$.next(false);
    });
  }

  public setPageSize(size: number): boolean {
    if (size == this.userPageSize$.getValue()) return false;
    this.userPage$.next(1);
    this.userPageSize$.next(size);
    this.pullUsers();
    return true;
  }

  public getUsers(): Observable<{ content: IEEEuser[], count: number, loading: boolean }> {
    return combineLatest([this.users$, this.userCount$, this.loading$]).pipe(
      map(([users, count, loading]) => ({ content: users, count, loading })),
      distinctUntilChanged()
    );
  }

  public updateUserLocally(user: IEEEuser) {
    let users = this.users$.getValue();
    let userIndex = users.findIndex(u => u.email == user.email);
    if (userIndex < 0) return;
    users[userIndex] = user;
    this.users$.next(users);
  }

  public getUserPage(): Observable<{ page: number, size: number }> {
    return combineLatest([this.userPage$, this.userPageSize$]).pipe(map(([page, size]) => ({ page, size })));
  }

  private setCursors(users: IEEEuser[]) {
    if (users.length > 0) {
      this.startCursor$.next(users[0]);
      this.endCursor$.next(users[users.length - 1]);
    }
    else {
      this.startCursor$.next(null);
      this.endCursor$.next(null);
    }
  }
}
