import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IEEEuser} from "../../models/ieee-user/ieee-user";
import {NgxImageCompressService} from "ngx-image-compress";
import {BehaviorSubject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {AlertModalComponent} from "../alert-modal/alert-modal.component";
import {MDBModalRef, MDBModalService} from "angular-bootstrap-md";
import {ImageUtils} from "../../utils/imageUtils";
import {ImageCropperModalComponent} from "../image-cropper-modal/image-cropper-modal.component";

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
    cropperModalRef: MDBModalRef | null = null;

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
        const inputElement = event.target as HTMLInputElement;
        const picture: File = inputElement?.files?.[0];
        if (!picture) return;

        const type: string = picture.type.split('/')[1]?.toLowerCase();
        if (picture.type.split('/')[0] != 'image') {
            inputElement.value = '';
            return this.error$.next("FILE_TYPE");
        }
        if (!extensions.includes(type)) {
            inputElement.value = '';
            return this.error$.next("FILE_EXTENSION");
        }

        this.cropperModalRef = this.modalService.show(ImageCropperModalComponent, {
            data: {
                imageFile: picture
            },
            class: 'modal-dialog-centered modal-lg'
        });

        this.cropperModalRef.content.croppedImage.subscribe((croppedBase64: string) => {
            this.imageCompress.compressFile(croppedBase64, -1, 50, 75, 800, 800)
                .then(res => {
                    if (this.imageCompress.byteCount(res) > 1024 * 1024 * sizeLimit) throw new Error("Compression not enough");
                    
                    let extension = 'png';
                    const matches = res.match(/^data:(image\/[a-z]+);base64,/i);
                    if (matches) {
                        extension = matches[1].split('/')[1];
                    }
                    
                    this.photoURLChange.emit(res);
                    this.pictureTypeChange.emit(extension);
                })
                .catch(err => {
                    this.error$.next("COMPRESSION_FAILED");
                    console.error(err);
                });
        });

        inputElement.value = '';
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
