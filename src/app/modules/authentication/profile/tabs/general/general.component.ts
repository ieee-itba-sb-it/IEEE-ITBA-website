import {Component, OnInit} from '@angular/core';
import {AuthError} from '@angular/fire/auth';
import {TranslateService} from '@ngx-translate/core';
import {MDBModalRef, MDBModalService} from 'angular-bootstrap-md';
import {NgxImageCompressService} from 'ngx-image-compress';
import {BehaviorSubject, concatMap, Observable, of} from 'rxjs';
import {AuthService} from 'src/app/core/services/authorization/auth.service';
import {AlertModalComponent} from 'src/app/shared/components/alert-modal/alert-modal.component';
import {IEEEuser} from 'src/app/shared/models/ieee-user/ieee-user';
import {roles} from "../../../../../shared/models/roles/roles.enum";
import {IEEEMember} from "../../../../../shared/models/team-member";

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

    user$: Observable<IEEEuser>;
    actual: IEEEuser;
    changes: IEEEuser;
    picturetype: string;

    loading: boolean = false;
    error$: BehaviorSubject<string>;
    errorModalRef: MDBModalRef | null = null;

    shake: boolean;

    constructor(private authService: AuthService, private modalService: MDBModalService, private translate: TranslateService, private imageCompress: NgxImageCompressService) {
        this.user$ = this.authService.getCurrentUser();
        this.error$ = new BehaviorSubject(null);
    }

    ngOnInit(): void {
        this.user$.subscribe(data => {
            this.actual = {...data};
            this.changes = {...data};
        });
        this.error$.subscribe((error) => {
            if (!error) return delete this.errorModalRef;
            this.translate.get(`PROFILE.ERRORS.${error}`).subscribe({
                next: (res) => {
                    console.error(error);
                    this.openErrorModal(res)
                }
            });
        });
    }

    // Firebase updates

    updateUser(): void {
        if (!this.hasChange()) return;
        this.loading = true;
        let hasPhotoChanged = this.changes.photoURL && this.changes.photoURL != this.actual.photoURL && this.picturetype;

        let operation$: Observable<string> = hasPhotoChanged ?
            this.authService.updateProfilePic(this.changes.photoURL, this.picturetype) :
            of(undefined);

        if (this.actual.roles.includes(roles.member)) {
            operation$ = operation$.pipe(
                concatMap((newPath) => {
                    let data: Partial<IEEEMember> = {
                        name: this.changes.fullname,
                        linkedin: this.changes.linkedin,
                        email: this.actual.email
                    }
                    if (newPath !== undefined) data.photo = newPath;
                    return this.authService.updateTeamProfile(data);
                })
            )
        }

        operation$.pipe(
            concatMap(newpath => this.authService.updateProfile({photoURL: newpath, ...this.changes}))
        ).subscribe({
            next: () => {
                this.loading = false;
                this.changes.photoURL = this.actual.photoURL;
                this.error$.next(null);
            },
            error: (err: AuthError) => {
                this.error$.next(err.code.toUpperCase());
                this.loading = false;
            }
        });
    }

    // Local updates

    discardChanges(): void {
        this.changes = {...this.actual};
        this.shake = true;
        setTimeout(() => this.shake = false, 400);
    }

    // Utils

    hasChange(): boolean {
        return JSON.stringify(this.actual) != JSON.stringify(this.changes);
    }

    openErrorModal(error: string): void {
        this.errorModalRef = this.modalService.show(AlertModalComponent, {
            data: {
                message: error,
                type: "error"
            },
            key: error,
            class: 'modal-dialog-centered',
        });
    }

}
