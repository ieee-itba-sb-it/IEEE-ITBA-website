import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MDBModalRef } from 'angular-bootstrap-md';
import { TeamService } from 'src/app/core/services/team/team.service';
import { Commission, Position } from 'src/app/shared/models/commission';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import {InternationalText} from "../../../../shared/models/data-types";
import {BehaviorSubject, Observable, Observer} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {IEEEUserFilters} from "../../../../shared/models/ieee-user/ieee-user-filters";
import {AdminService} from "../../../../core/services/admin/admin.service";
import {IEEEMember} from "../../../../shared/models/team-member";
import {UserManagerService} from "../../pages/user.manager";
import {roles} from "../../../../shared/models/roles/roles";
import {Colors} from "chart.js";
import {ThemePalette} from "@angular/material/core";

@Component({
    selector: 'app-position-editor-modal',
    templateUrl: './position-editor-modal.component.html',
    styleUrls: ['./position-editor-modal.component.css'],
    providers: [UserManagerService]
})
export class PositionEditorModalComponent implements OnInit {
    @Input() commission: Commission;
    @Input() positionIdx: number;
    @Output() update: EventEmitter<Position> = new EventEmitter();
    @Output() updateMembers: EventEmitter<IEEEMember[]> = new EventEmitter();

    readonly MEMBERS_NAME: InternationalText = {es: "Miembros", en: "Members"};
    readonly TITLE: InternationalText = {es: "Título", en: "Title"};
    readonly ADD_MEMBERS: InternationalText = {es: "Añadir miembros:", en: "Add members:"};
    readonly ADD: InternationalText = {es: "Añadir", en: "Add"};

    addingUser: BehaviorSubject<boolean>;
    error: string;
    loading: boolean = false;

    positionForm: FormGroup;

    headElements: InternationalText[] = [
        {es: "#", en: "#"},
        {es: "Nombre", en: "Name"},
        {es: "Correo", en: "Email"},
        {es: "Foto", en: "Photo"}
    ];

    readonly pageSize: number = 10;
    localMembers: IEEEMember[];
    localUsers: {user: IEEEuser, selected: boolean}[] = [];
    selectedUsers: IEEEuser[] = [];
    users$: Observable<{content: IEEEuser[], count: number, loading: boolean }>;
    filters: IEEEUserFilters = {};
    searchbarTimeout;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private teamService: TeamService, public modalRef: MDBModalRef, private readonly adminService: AdminService, private userManagerService: UserManagerService) {
        this.positionForm = new FormGroup({
            id: new FormControl('', Validators.required),
            title: new FormGroup({
                en: new FormControl('', Validators.required),
                es: new FormControl('', Validators.required)
            })
        });
        adminService.setCollectionName('users');
    }

    ngOnInit() {
        if(this.positionIdx != null) {
            this.positionForm.patchValue(this.commission.positions[this.positionIdx]);
        }
        this.userManagerService.setPageSize(this.pageSize);
        this.addingUser = new BehaviorSubject<boolean>(false);
        this.users$ = this.userManagerService.getUsers();
        this.firstPage();
        if(this.editMode()) {
            this.localMembers = this.commission.positions[this.positionIdx].members;
            this.users$.subscribe((users) => {
                this.localUsers = users.content.map((user) => ({user, selected: false}));

                this.localUsers.forEach((userModel) => {
                    if(this.commission.positions[this.positionIdx].members.includes(this.userToMember(userModel.user))) {
                        this.localUsers.at(this.getUserIndex(userModel.user)).selected = true;
                    }
                });
            });
        }
    }

    userToMember(user: IEEEuser): IEEEMember {
        return new IEEEMember(user.fullname, user.email,
            this.commission.id, this.commission.positions[this.positionIdx].id);
    }

    deletePosition() {
        if (this.positionIdx == undefined) return;
        this.commission.positions.splice(this.positionIdx, 1);
        this.commission.positions.forEach((position, index) => {
            position.order = index;
        });
    }

    addPosition() {
        if(this.loading) return;
        if(this.positionForm.invalid) {
            this.error = "Error en el cargado del formulario.";
            return;
        }
        let position : Position = this.positionForm.value as Position;
        let index: number = (this.positionIdx == undefined ? this.commission.positions.length : this.positionIdx);
        position.order = index;
        position.members = this.positionIdx == undefined ? [] : this.commission.positions[this.positionIdx].members;
        this.commission.positions[index] = position;
        this.commission.positions.sort((a, b) => a.order - b.order);
        this.loading = true;
        this.teamService.setCommission(this.commission).subscribe(res => {
            this.update.emit(this.commission);
            this.modalRef.hide();
        });
    }

    hasChanged() {
        if (this.positionIdx == undefined) return JSON.stringify(this.positionForm.value) != "{}";
        let position = {...this.commission.positions[this.positionIdx]};
        delete position.order;
        delete position.members;
        return JSON.stringify(position) != JSON.stringify(this.positionForm.value);
    }

    editMode() {
        return this.positionIdx != undefined;
    }

    openMemberForm() {
        this.addingUser.next(true);
    }

    addMembers() {
        this.teamService.addMembers(this.selectedUsers.map(user => {
            return this.userToMember(user);
        }), this.commission).subscribe(membersToAdd => {
            membersToAdd.forEach((member) => {this.localMembers.push(member);});
        });
        this.selectedUsers = [];
        this.addingUser.next(false);
        //emit
    }

    removeMember(member: IEEEMember) {
        this.teamService.removeMember(member, this.commission).subscribe(memberToRemove => {
            this.localMembers.splice(this.localMembers.indexOf(memberToRemove), 1);
        });
        //emit
    }

    isSelected(user: IEEEuser): boolean {
        return this.selectedUsers.includes(user);
    }

    belongsToPosition(user: IEEEuser): boolean {
        for(let member of this.localMembers) {
            if(member.email == user.email) return true;
        }
        return false;
    }

    getUserIndex(user: IEEEuser) {
        return this.selectedUsers.findIndex((userModel) => {return userModel === user;});
    }

    selectUser(user: IEEEuser) {
        let index: number;
        if((index = this.getUserIndex(user)) == -1) {
            this.selectedUsers.push(user);
        } else {
            this.selectedUsers.splice(index, 1);
        }
    }

    handlePageEvent(e: PageEvent) {
        if (e.pageIndex > e.previousPageIndex) this.nextPage();
        if (e.pageIndex < e.previousPageIndex) this.prevPage();
    }

    handleSearchbarEvent(e: any) {
        if(this.searchbarTimeout) clearTimeout(this.searchbarTimeout);
        this.searchbarTimeout = setTimeout(() => {
            if(e.target.value == this.filters.email) return;
            if(e.target.value.trim() == "") delete this.filters.email;
            else this.filters.email = e.target.value;
            if(this.paginator) this.paginator.firstPage();
            this.userManagerService.applyFilters(this.filters);
        }, 1000);
    }

    nextPage() {
        this.userManagerService.pullNextPage();
    }

    prevPage() {
        this.userManagerService.pullPrevPage();
    }

    firstPage() {
        if(this.paginator) this.paginator.firstPage();
        this.userManagerService.pullUsers();
    }

    protected readonly roles = roles;
    protected readonly Colors = Colors;
}
