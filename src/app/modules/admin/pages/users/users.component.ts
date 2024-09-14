import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { UserEditorModalComponent } from 'src/app/shared/components/user-editor-modal/user-editor-modal.component';
import { roles } from 'src/app/shared/models/roles/roles';
import { IEEEUserFilters } from 'src/app/shared/models/ieee-user/ieee-user-filters';
import { UserManagerService } from './user.manager';
import { MatChipListboxChange } from '@angular/material/chips';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserManagerService]
})
// https://v5-angular-4.legacydocs.mdbootstrap.com/docs/angular/data/tables/
export class UsersComponent implements OnInit {

  users$: Observable<{content: IEEEuser[], count: number, loading: boolean}>;

  filters: IEEEUserFilters = {};
  searchbarTimeout;

  modalRef: MDBModalRef | null = null;
  roles = roles;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userManagerService: UserManagerService, private modalService: MDBModalService) {}

  nextPage() {
    this.userManagerService.pullNextPage();
  }

  prevPage() {
    this.userManagerService.pullPrevPage();
  }

  firstPage() {
    if (this.paginator) this.paginator.firstPage();
    this.userManagerService.pullUsers();
  }

  handlePageEvent(e: PageEvent) {
    if (e.pageIndex > e.previousPageIndex) this.nextPage();
    if (e.pageIndex < e.previousPageIndex) this.prevPage();
    if (this.userManagerService.setPageSize(e.pageSize)) this.paginator.firstPage();
  }

  handleSearchbarEvent(e: any) {
    if (this.searchbarTimeout) clearTimeout(this.searchbarTimeout);
    this.searchbarTimeout = setTimeout(() => {
      if (e.target.value == this.filters.email) return;
      if (e.target.value.trim() == "") delete this.filters.email;
      else this.filters.email = e.target.value;
      if (this.paginator) this.paginator.firstPage();
      this.userManagerService.applyFilters(this.filters);
    }, 1000);
  }

  handleRoleFilterEvent(e: MatChipListboxChange) {
    this.filters.roles = e.value;
    if (e.value.length <= 0) delete this.filters.roles;
    if (this.paginator) this.paginator.firstPage();
    this.userManagerService.applyFilters(this.filters);
  }

  openModal(user: IEEEuser) {
    this.modalRef = this.modalService.show(UserEditorModalComponent, {
        data: {
            user: user
        },
        class: 'modal-dialog-centered',
    });
    this.modalRef.content.update.subscribe(user => {
      this.userManagerService.updateUserLocally(user);
    })
  }

  ngOnInit(): void {
    this.users$ = this.userManagerService.getUsers();
    this.firstPage();
  }

}
