import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IEEEuser} from "../../models/ieee-user/ieee-user";
import {NgxImageCompressService} from "ngx-image-compress";
import {BehaviorSubject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {AlertModalComponent} from "../alert-modal/alert-modal.component";
import {MDBModalRef, MDBModalService} from "angular-bootstrap-md";
import {ImageUtils} from "../../utils/imageUtils";

@Component({
    selector: 'app-upload-picture-input',
    templateUrl: './upload-picture-input.component.html',
    styleUrls: ['./upload-picture-input.component.css']
})
export class UploadPictureInputComponent {

    @Input() photoURL: string;
    @Output() photoURLChange = new EventEmitter<string>();
    @Input() pictureType: string;
    @Output() pictureTypeChange = new EventEmitter<string>();
    @Input() rowDisplay: boolean = false;
    error$: BehaviorSubject<string>;
    errorModalRef: MDBModalRef | null = null;

    constructor(
        private imageCompress: NgxImageCompressService,
        private translate: TranslateService,
        private modalService: MDBModalService
    ) {
        this.error$ = new BehaviorSubject(null);
        this.error$.subscribe((error) => {
            if (!error) return delete this.errorModalRef;
            this.translate.get(`PROFILE.ERRORS.${error}`).subscribe({
                next: (res) => {this.openErrorModal(res)},
                error: (err) => {this.openErrorModal(error)}
            });
        })
    }

    uploadPicture(event: Event): void {
        const sizeLimit: number = 10;
        const extensions: string[] = ['png', 'jpg', 'jpeg'];
        const picture: File = event.target['files'][0];
        const type: string = picture.type.split('/')[1];
        if (!picture) return;
        if (picture.type.split('/')[0] != 'image') return this.error$.next("FILE_TYPE");
        if (!extensions.includes(type)) return this.error$.next("FILE_EXTENSION");
        this.imageCompress.getOrientation(picture)
            .then(async orientation => {
                const base = await ImageUtils.toBase64(picture);
                return this.imageCompress.compressFile(base, orientation, 100, 100, 1024, 1024);
            })
            .then(res => {
                if (this.imageCompress.byteCount(res) > 1024 * 1024 * sizeLimit) throw new Error("Compression not enough");
                this.photoURLChange.emit(res);
                this.pictureTypeChange.emit(picture.type.split('/')[1]);
            })
            .catch(err => {
                this.error$.next("COMPRESSION_FAILED");
                console.log(err.image);
            });
    }

    deletePicture(): void {
        this.photoURLChange.emit(null);
        this.pictureTypeChange.emit(null);
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
}
