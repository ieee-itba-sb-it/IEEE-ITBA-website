import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.css']
})
export class ImageCropperModalComponent implements OnInit {
  @Input() imageFile: File;
  @Input() imageBase64?: string;
  @Output() croppedImage = new EventEmitter<string>();

  croppedBase64: string = '';
  scale: number = 1;
  canvasRotation: number = 0;
  transform: ImageTransform = {
    scale: 1,
    rotate: 0,
    flipH: false,
    flipV: false
  };
  loading: boolean = true;
  loadFailed: boolean = false;

  constructor(public modalRef: MDBModalRef) {}

  ngOnInit(): void {
    this.updateTransform();
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.base64) {
      this.croppedBase64 = event.base64;
    } else if (event.objectUrl) {
      this.croppedBase64 = event.objectUrl;
    }
  }

  imageLoaded(): void {
    this.loading = false;
    this.loadFailed = false;
  }

  cropperReady(): void {
    this.loading = false;
  }

  loadImageFailed(): void {
    this.loading = false;
    this.loadFailed = true;
  }

  onZoomChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.scale = parseFloat(target.value);
      this.updateTransform();
    }
  }

  zoomIn(): void {
    this.scale = Math.min(3, +(this.scale + 0.1).toFixed(2));
    this.updateTransform();
  }

  zoomOut(): void {
    this.scale = Math.max(0.5, +(this.scale - 0.1).toFixed(2));
    this.updateTransform();
  }

  rotateLeft(): void {
    this.canvasRotation -= 90;
    this.updateTransform();
  }

  rotateRight(): void {
    this.canvasRotation += 90;
    this.updateTransform();
  }

  reset(): void {
    this.scale = 1;
    this.canvasRotation = 0;
    this.updateTransform();
  }

  private updateTransform(): void {
    this.transform = {
      scale: this.scale,
      rotate: this.canvasRotation,
      flipH: false,
      flipV: false
    };
  }

  apply(): void {
    if (this.croppedBase64) {
      this.croppedImage.emit(this.croppedBase64);
    }
    this.modalRef.hide();
  }

  cancel(): void {
    this.modalRef.hide();
  }
}
