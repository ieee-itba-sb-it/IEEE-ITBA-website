import { Component, Input } from '@angular/core';
import SwiperCore, { Navigation, Autoplay, Lazy, SwiperOptions } from 'swiper';

SwiperCore.use([Navigation, Autoplay, Lazy]);

@Component({
    selector: 'app-image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent {
    @Input() imageLinks: string[] = [];

    swiperConfig: SwiperOptions = {
        navigation: true,
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        // Only the visible slide and its neighbours are fetched; the rest load
        // as the user (or autoplay) reaches them.
        preloadImages: false,
        watchSlidesProgress: true,
        lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }
    };
}
