import {Component, OnInit} from '@angular/core';
import {concat, concatAll, concatMap, concatWith, forkJoin, map, Observable, of} from "rxjs";
import {IEEEuser} from "../../../shared/models/ieee-user/ieee-user";
import {AuthService} from "../../../core/services/authorization/auth.service";
import {TeamService} from "../../../core/services/team/team.service";
import {Commission, Position} from "../../../shared/models/commission";
import {AlertModalComponent, AlertModalType} from "../../../shared/components/alert-modal/alert-modal.component";
import {MDBModalRef, MDBModalService} from "angular-bootstrap-md";
import {ActivatedRoute, Router} from "@angular/router";
import {IEEEMember} from "../../../shared/models/team-member";
import {log} from "firebase-functions/lib/logger";

@Component({
    selector: 'app-team-request',
    templateUrl: './team-request.component.html',
    styleUrls: ['./team-request.component.css']
})
export class TeamRequestComponent implements OnInit {

    user$: Observable<IEEEuser>
    commissions$: Observable<Commission[]>
    areRequestsOpen$: Observable<boolean>

    actualUser: IEEEuser;
    changedUser: IEEEuser;
    hasChangedImage: boolean = false;
    pictureType: string;

    selectedCommission: Commission;
    selectedPosition: Position;

    loading: boolean = false;

    alertModalRef: MDBModalRef | null = null;

    constructor(
        private authService: AuthService,
        private teamService: TeamService,
        private modalService: MDBModalService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.user$ = this.authService.getCurrentUser();
        this.commissions$ = this.teamService.getAllCommissions();
        this.areRequestsOpen$ = this.teamService.getIsTeamRequestOpen();
    }

    ngOnInit() {
        this.user$.subscribe(user => {
            this.actualUser = {...user};
            this.changedUser = {...user};
        });
        this.route.queryParams.subscribe({
            next: (params) => {
                if (params.verified) {
                    this.openAlertModal("success", "PROFILE.MESSAGES.SUCCESS_EMAIL_VERIFICATION");
                    this.authService.reloadToken().subscribe();
                };
            }
        });
        this.modalService.closed.subscribe(() => {
            this.router.navigate([], {
                queryParams: {
                    'verified': null,
                },
                queryParamsHandling: 'merge'
            })
        });
    }

    isFieldPresent(field: string): boolean {
        return field && field.trim() != "";
    }

    canSendTeamRequest(): boolean {
        return  this.isFieldPresent(this.changedUser.fullname) &&
                this.isFieldPresent(this.changedUser.linkedin) &&
                this.selectedCommission != null &&
                this.selectedPosition != null &&
                this.actualUser.verifiedEmail;
    }

    sendTeamRequest(): void {
        if (!this.canSendTeamRequest()) return;
        this.loading = true;

        let photoChanged = this.actualUser.photoURL != this.changedUser.photoURL;
        let userChanged = JSON.stringify(this.actualUser) != JSON.stringify(this.changedUser);
        let operation$: Observable<string> = photoChanged ?
            this.authService.updateProfilePic(this.changedUser.photoURL, this.pictureType) :
            of(null);

        operation$.pipe(
            concatMap((newPath) => {
                if (userChanged) {
                    return this.authService.updateProfile({ photoURL: newPath ?? this.changedUser.photoURL, ...this.changedUser })
                        .pipe(map(() => newPath));
                }
                return of(newPath);
            }),
            concatMap((newPath) => {
                return this.teamService.createTeamRequest(
                    IEEEMember.fromUser(
                        { photoURL: newPath ?? this.changedUser.photoURL, ...this.changedUser },
                        this.selectedCommission.id,
                        this.selectedPosition.id
                    )
                );
            })
        ).subscribe({
            next: () => {
                this.loading = false;
                this.openAlertModal("success", "Solicitud enviada, gracias!");
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.openAlertModal("error", "Ocurrió un error al enviar la solicitud.");
            }
        })
    }

    sendVerificationEmail(): void {
        const url = `${window.location.href}?verified=true`
        this.authService.sendVerificationEmail(url).subscribe({
            next: () => this.openAlertModal("success", "PROFILE.MESSAGES.EMAIL_SENT"),
            error: (err) => this.openAlertModal("error", err)
        });
    }

    openAlertModal(type: AlertModalType, message: string): void {
        this.alertModalRef = this.modalService.show(AlertModalComponent, {
            data: {
                message: message,
                type: type
            },
            class: 'modal-dialog-centered',
        });
    }

}
