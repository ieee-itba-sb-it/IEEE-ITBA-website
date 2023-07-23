import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';
import {BlogService} from '../../../../core/services/blog/blog.service';
import {NewsItem} from '../../../../shared/models/news-item/news-item';
import {blogCollectionName} from '../../../../secrets';
import SwiperCore, {Pagination, Navigation, Autoplay, SwiperOptions} from 'swiper';
import {EventService} from '../../../../core/services/event/event.service';
import {EventCardData} from '../../../../shared/models/event/event-card-data';

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

  latestEvents: EventCardData[];

  swiperConfig: SwiperOptions = {
    pagination: {
      el: '#news-pagination-wrapper',
      clickable: true
    },
    navigation: {
      nextEl: '#news-pagination-next',
      prevEl: '#news-pagination-prev'
    },
    preloadImages: false,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    slidesPerView: 1,
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

  swiperConfigEvents: SwiperOptions = {
    pagination: {
      el: '#events-pagination-wrapper',
      clickable: true
    },
    navigation: {
      nextEl: '#events-pagination-next',
      prevEl: '#events-pagination-prev'
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

  constructor(private blogService: BlogService,
              private sponsorsService: SponsorsService,
              private eventService: EventService) {
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

    this.latestEvents = eventService.getUpcomingEvents();
  }

  ngOnInit(): void {}

}
