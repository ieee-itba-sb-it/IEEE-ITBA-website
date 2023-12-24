import { Component, Input } from '@angular/core';
import SwiperCore, { Navigation, Autoplay, Lazy, SwiperOptions } from 'swiper';

SwiperCore.use([Navigation, Autoplay, Lazy]);

@Component({
    selector: 'app-image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent {
    @Input() imageLinks: [];

    swiperConfig: SwiperOptions = {
        navigation: true,
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }
    };

    swiperOn: boolean = false;

    ngAfterViewInit(): void {
        this.preloadImages(this.imageLinks).then((res) => {
            this.swiperOn = true;
        });
    }

    preloadImages(images: string[]): Promise<void[]> {
        const promises = images.map((src) => this.preloadImage(src));
        return Promise.all(promises);
    }

    preloadImage(src: string): Promise<void> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.src = src;
        });
    }
}
