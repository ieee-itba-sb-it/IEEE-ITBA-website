import { Component, OnInit } from '@angular/core';
import SwiperCore, {Pagination, Navigation, Autoplay, Thumbs, SwiperOptions} from 'swiper/core';
import firebase from 'firebase';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

SwiperCore.use([Pagination, Navigation, Autoplay, Thumbs]);
@Component({
  selector: 'app-iot',
  templateUrl: './iot.component.html',
  styleUrls: ['./iot.component.css']
})
export class IotComponent implements OnInit {
  images = [1, 2, 4, 7, 3, 6].map((n) => `../../../assets/image/iot/image${n}.jpg`);
  enrollLink = 'https://forms.gle/mUWavTU2wcRY1xqJ6';
  enrollEndDate = '22 Nov 2022 03:00:00 UTC';

  faq = [
    { q: "IOT.FAQ.1.QUESTION", a: "IOT.FAQ.1.ANSWER" },
    { q: "IOT.FAQ.2.QUESTION", a: "IOT.FAQ.2.ANSWER" }
  ];

  swiperConfig: SwiperOptions = {
    spaceBetween: 10,
    navigation: true,
    slidesPerView: 1,
    preloadImages: false,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    breakpoints: {
      940: {
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
    let now = firebase.firestore.Timestamp.now();
    console.log(now);
    return now < Timestamp.fromDate(new Date(this.enrollEndDate));
  }

  constructor() { }

  ngOnInit(): void {
  }

}
