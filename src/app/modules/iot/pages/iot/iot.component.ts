import { Component, OnInit } from '@angular/core';
import SwiperCore, { Navigation, Autoplay, Lazy, SwiperOptions } from 'swiper';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

SwiperCore.use([Navigation, Autoplay, Lazy]);

@Component({
  selector: 'app-iot',
  templateUrl: './iot.component.html',
  styleUrls: ['./iot.component.css']
})
export class IotComponent implements OnInit {
  images = [1, 2, 4, 7, 3, 6].map((n) => `../../../assets/image/events/iot/image${n}.jpg`);

  // TODO: Download images dynamically
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
    slidesPerView: 1,
    preloadImages: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    breakpoints: {
      1024: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      1680: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  };

  isEnrollingAvailable() {
    const now = Timestamp.now();
    return now < Timestamp.fromDate(new Date(this.enrollEndDate));
  }

  constructor() { }

  ngOnInit(): void {
  }

}
