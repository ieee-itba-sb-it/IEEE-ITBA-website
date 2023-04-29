import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements AfterViewInit {
  static RESIZER_CDN = 'https://imagecdn.app/v2/image';

  @Input() ngSrc: string;
  @Input() ngWidth?: number;
  @Input() ngHeight?: number;

  private element: ElementRef;

  constructor(private initElement: ElementRef) {
    this.element = initElement;
  }


  get resizedSrc() {
    let resultSource = `${ResizeDirective.RESIZER_CDN}/${this.ngSrc}?format=webp`;
    if (this.ngWidth) {
      resultSource += `&width=${this.ngWidth}`;
    }
    if (this.ngHeight) {
      resultSource += `&height=${this.ngHeight}`;
    }
    return resultSource;
  }

  ngAfterViewInit(): void {
    this.initElement.nativeElement.src = this.resizedSrc;
    const images = this.element.nativeElement.querySelectorAll('img');
    for (const imageElement of images) {
      imageElement.src = this.resizedSrc;
    }
  }
}
