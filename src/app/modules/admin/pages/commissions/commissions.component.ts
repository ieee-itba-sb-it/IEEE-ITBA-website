import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Component, OnInit} from '@angular/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { CommissionEditorModalComponent } from 'src/app/shared/components/commission-editor-modal/commission-editor-modal.component';
import {Commission} from "../../../../shared/models/commission";
import {BehaviorSubject, Observable} from "rxjs";
import {TeamService} from "../../../../core/services/team/team.service";

@Component({
    selector: 'app-commissions',
    templateUrl: './commissions.component.html',
    styleUrls: ['./commissions.component.css']
})
export class CommissionsComponent implements OnInit {

    editPositionsMode: boolean = false;

    modalRef: MDBModalRef | null = null;

    commissions$: Observable<Commission[]>;

    commissions: Commission[];

    loading: BehaviorSubject<boolean>;

    constructor(private modalService: MDBModalService, private teamService: TeamService) {
        this.commissions$ = this.teamService.getTeamCommissions();
        this.loading = new BehaviorSubject(true);
    }

    ngOnInit() {
        this.commissions$.subscribe(commissions => {
            this.commissions = commissions;
            this.loading.next(false);
        })
    }

    drop(event: CdkDragDrop<string[]>) {
        if (!this.editPositionsMode) return;
        moveItemInArray(this.commissions, event.previousIndex, event.currentIndex);
        this.commissions.forEach((commission, index) => {
            commission.position = index;
        });
    }

    toggleEditPositionsMode() {
        this.editPositionsMode = !this.editPositionsMode;
    }

    openModal() {
        this.modalRef = this.modalService.show(CommissionEditorModalComponent, {
            data: {
                position: this.commissions.length
            },
            class: 'modal-dialog-centered',
        });
        this.modalRef.content.update.subscribe(commission => {
            this.commissions.push(commission);
        })
    }
}