import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

import {BlogService} from '../../../../core/services/blog/blog.service';
import {newsItem} from '../../../../shared/models/news-item/news-item';
import {blogCollectionName} from '../../../../secrets';
import SwiperCore, {Pagination, Navigation, Autoplay, SwiperOptions} from 'swiper/core';

SwiperCore.use([Pagination, Navigation, Autoplay]);

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})

export class MainpageComponent implements OnInit {
  newsDataObs: Observable<newsItem[]>;
  latestNews: newsItem[];
  latestLimit = 12;
  showLoadingSpinner = true;

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

  constructor(public translate: TranslateService, private blogService: BlogService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/) ? browserLang : 'en');

    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.getDocs();
    this.newsDataObs = this.blogService.docsObs();

    this.newsDataObs.subscribe((data: newsItem[]) => {
      // cuando hay nuevas noticias se llama este codigo
      this.latestNews = data;
      this.latestNews.sort((a: newsItem, b: newsItem) => (a.date.getTime() > b.date.getTime() ? -1 : 1));

      const aux: newsItem[] = [];
      for (let i = 0; i < this.latestNews.length; i++){
        if (i < this.latestLimit){
          aux.push(this.latestNews[i]);
        }
      }

      this.latestNews = aux;
      this.showLoadingSpinner = false;
    });
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {}

}
