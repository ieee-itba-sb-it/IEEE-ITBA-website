import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BlogService } from '../blog.service';
import { newsItem } from '../data-types';
import { blogCollectionName } from '../secrets';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {
  newsDataObs: Observable<newsItem[]>;
  latestNews: newsItem[];


  constructor(public translate: TranslateService, private blogService: BlogService) {
    translate.addLangs(['en','es']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/)? browserLang:'en');

    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.getDocs();
    this.newsDataObs = this.blogService.docsObs();

    this.newsDataObs.subscribe((data: newsItem[]) => {
      // cuando hay nuevas noticias se llama este codigo
      this.latestNews = data;
      this.latestNews.sort((a: newsItem, b: newsItem) => (a.date.getTime() > b.date.getTime() ? -1 : 1));

      this.latestNews.slice(5, this.latestNews.length -1);

      console.log("aca estan las latest news", this.latestNews);

    });
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {
  }

}
