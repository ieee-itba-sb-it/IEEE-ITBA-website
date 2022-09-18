import { Component, OnInit } from '@angular/core';
import SwiperCore, {Pagination, Navigation, Autoplay, SwiperOptions} from 'swiper/core';
SwiperCore.use([Pagination, Navigation, Autoplay]);
@Component({
  selector: 'app-iot',
  templateUrl: './iot.component.html',
  styleUrls: ['./iot.component.css']
})
export class IotComponent implements OnInit {
  images = [1,2].map((n) => `../../../assets/image/iot/image${n}.jpg`);
  constructor() { }

  ngOnInit(): void {
  }

}
