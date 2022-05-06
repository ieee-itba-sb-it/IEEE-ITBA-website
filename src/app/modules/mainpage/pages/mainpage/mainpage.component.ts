import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BlogService } from '../../../../core/services/blog/blog.service';
import { newsItem } from '../../../../shared/models/news-item/news-item';
import { blogCollectionName } from '../../../../secrets';

import { OwlOptions } from 'ngx-owl-carousel-o';

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

  customOptions: any = {
    loop: true,
    margin: 10,
    autoplay: true,
    responsiveClass: true,
    navText: ['<', '>'],
    responsive: {
      0: { items: 1 },
      480: { items: 2 },
      940: { items: 3 }
    },
    nav: true
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

      console.log('aca estan las latest news', this.latestNews);

    });
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {
  }

}
