import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';
import {BlogService} from '../../../../core/services/blog/blog.service';
import {NewsItem} from '../../../../shared/models/news-item/news-item';
import {blogCollectionName} from '../../../../secrets';
import SwiperCore, {Pagination, Navigation, Autoplay, SwiperOptions} from 'swiper/core';

SwiperCore.use([Pagination, Navigation, Autoplay]);

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})

export class MainpageComponent implements OnInit {
  newsDataObs: Observable<NewsItem[]>;
  latestNews: NewsItem[];
  latestLimit = 9;
  showLoadingSpinner = true;
  sponsorsServiceVar: SponsorsService;

  swiperConfig: SwiperOptions = {
    pagination: {
      el: '.pagination-wrapper',
      clickable: true
    },
    navigation: {
      nextEl: '.pagination-next',
      prevEl: '.pagination-prev'
    },
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
      1340: {
        slidesPerView: 3,
        spaceBetween: 15
      },
      1680: {
        slidesPerView: 4,
        spaceBetween: 20
      }
    }
  };

  constructor(private blogService: BlogService, private sponsorsService: SponsorsService) {
    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.getDocs();
    this.newsDataObs = this.blogService.docsObs();
    this.sponsorsServiceVar = sponsorsService;
    this.newsDataObs.subscribe((data: NewsItem[]) => {
      // cuando hay nuevas noticias se llama este codigo
      this.latestNews = data;
      this.latestNews.sort((a: NewsItem, b: NewsItem) => (a.date.getTime() > b.date.getTime() ? -1 : 1));

      const aux: NewsItem[] = [];
      for (let i = 0; i < this.latestNews.length; i++){
        if (i < this.latestLimit){
          aux.push(this.latestNews[i]);
        }
      }

      this.latestNews = aux;
      this.showLoadingSpinner = false;
    });
  }

  ngOnInit(): void {}

}
