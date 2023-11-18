import { Component, OnInit } from '@angular/core';
import SwiperCore, { Navigation, Autoplay, Lazy, SwiperOptions } from 'swiper';
import {Timestamp} from '@angular/fire/firestore';

SwiperCore.use([Navigation, Autoplay, Lazy]);

@Component({
    selector: 'app-iot',
    templateUrl: './iot.component.html',
    styleUrls: ['./iot.component.css']
})
export class IotComponent implements OnInit {
    imageLinks = [
        'https://i.ibb.co/h2NXFqZ/image1.jpg',
        'https://i.ibb.co/4NWyHH0/image2.jpg',
        'https://i.ibb.co/WGdj7dn/image4.jpg',
        'https://i.ibb.co/cLr94M0/image7.jpg',
        'https://i.ibb.co/YTfrKfk/image3.jpg',
        'https://i.ibb.co/HF074sP/image6.jpg'
    ];

    enrollLink = 'https://forms.gle/mUWavTU2wcRY1xqJ6';
    enrollEndDate = '22 Nov 2022 03:00:00 UTC';

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

    isEnrollingAvailable() {
        const now = Timestamp.now();
        return now < Timestamp.fromDate(new Date(this.enrollEndDate));
    }

    constructor() { }

    ngOnInit(): void {}

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
