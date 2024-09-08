import { Component, OnInit } from '@angular/core';
import { AuthError } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { DOC_ORIENTATION, NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { AlertModalComponent } from 'src/app/shared/components/alert-modal/alert-modal.component';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';

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
                next: (res) => {this.openErrorModal(res)},
                error: (err) => {this.openErrorModal(error)}
            });
        });
    }

    // Firebase updates

    updateUser(): void {
        if (!this.hasChange()) return;
        this.loading = true;
        let tasks: Observable<boolean>[] = [];
        if (this.changes.photoURL && this.changes.photoURL != this.actual.photoURL && this.picturetype) {
            tasks.push(this.authService.updateProfilePic(this.changes.photoURL, this.picturetype));
            this.changes.photoURL = this.actual.photoURL;
        }
        tasks.push(this.authService.updateProfile(this.changes));
        zip(...tasks).subscribe({
            next: (res: boolean[]) => {
                this.loading = false;
                this.error$.next(null);
            },
            error: (err: AuthError) => {
                this.error$.next(err.code.toUpperCase());
                this.loading = false;
            }
        });
    }

    // Local updates

    uploadPicture(event: Event): void {
        const sizelimit: number = 2;
        const extensions: string[] = ['png', 'jpg', 'jpeg'];
        const picture: File = event.target['files'][0];
        const type: string = picture.type.split('/')[1];
        if (!picture) return;
        if (picture.type.split('/')[0] != 'image') return this.error$.next("FILE_TYPE");
        if (!extensions.includes(type)) return this.error$.next("FILE_EXTENSION");
        this.imageCompress.getOrientation(picture)
            .then(async orientation => {
                const base = await this.toBase64(picture);
                return this.imageCompress.compressFile(base, orientation, undefined, undefined, 1024, 1024);
            })
            .then(res => {
                if (this.imageCompress.byteCount(res) > 1024 * 1024 * sizelimit) throw new Error("Compression not enough");
                this.changes.photoURL = res;
                this.picturetype = picture.type.split('/')[1];
            })
            .catch(err => {
                this.error$.next("COMPRESSION_FAILED");
                console.log(err.image);
            });
    }

    deletePicture(): void {
        this.changes.photoURL = null;
    }

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
            class: 'modal-dialog-centered',
        });
    }

    toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result == "string") resolve(reader.result);
            else reject();
        };
        reader.onerror = reject;
    });

}
