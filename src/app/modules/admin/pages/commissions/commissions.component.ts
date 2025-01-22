import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Component, OnInit} from '@angular/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { CommissionEditorModalComponent } from 'src/app/modules/admin/components/commission-editor-modal/commission-editor-modal.component';
import {Commission } from "../../../../shared/models/commission";
import {BehaviorSubject, from, map, Observable, zip} from "rxjs";
import {TeamService} from "../../../../core/services/team/team.service";
import { PositionEditorModalComponent } from '../../components/position-editor-modal/position-editor-modal.component';
import { IEEEMember } from 'src/app/shared/models/team-member';

@Component({
    selector: 'app-commissions',
    templateUrl: './commissions.component.html',
    styleUrls: ['./commissions.component.css']
})
export class CommissionsComponent implements OnInit {

    editPositionsMode: boolean = false;

    modalRef: MDBModalRef | null = null;

    commissions$: Observable<Commission[]>;
    members$: Observable<IEEEMember[]>;

    commissions: Commission[];

    loading: BehaviorSubject<boolean>;

    constructor(private modalService: MDBModalService, private teamService: TeamService) {
        this.commissions$ = this.teamService.getTeamCommissions();
        this.members$ = this.teamService.getAllMembers();
        this.loading = new BehaviorSubject(true);
    }

    ngOnInit() {
        zip(this.commissions$, this.members$).subscribe(([commissions, members]) => {
            this.commissions = commissions;

            this.commissions.forEach(commission => {
                commission.positions.forEach(position => {
                    position.members = members.filter(member =>
                        member.positionid == position.id && member.commissionid == commission.id
                    )
                })
            })
            this.loading.next(false);
        });
    }

    dropCommission(event: CdkDragDrop<string[]>) {
        if (!this.editPositionsMode) return;
        moveItemInArray(this.commissions, event.previousIndex, event.currentIndex);
        this.commissions.forEach((commission, index) => {
            commission.order = index;
        });
    }

    dropPosition(commission: Commission, event: CdkDragDrop<string[]>) {
        if (!this.editPositionsMode) return;
        moveItemInArray(commission.positions, event.previousIndex, event.currentIndex);
    }

    toggleEditPositionsMode() {
        this.editPositionsMode = !this.editPositionsMode;
    }

    openCommissionModal() {
        this.modalRef = this.modalService.show(CommissionEditorModalComponent, {
            data: {
                order: this.commissions.length
            },
            class: 'modal-dialog-centered',
        });
        this.modalRef.content.update.subscribe(commission => {
            this.commissions.push(commission);
        });
    }

    openPositionModal(commission: Commission, position?: number) {
        this.modalRef = this.modalService.show(PositionEditorModalComponent, {
            data: {
                order: commission.positions.length,
                commission: commission,
                positionIdx: position
            },
            class: 'modal-dialog-centered modal-lg',
        });
        this.modalRef.content.update.subscribe(commission => {
            this.commissions.find(c => c.id === commission.id).positions = commission.positions;
        });
        //listen
    }
}
