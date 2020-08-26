import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { blogCollectionName } from '../secrets';
import { Observable } from 'rxjs';
import { newsItem } from '../data-types';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {
  newsData: Observable<newsItem>;
  content: string = "";
  data: newsItem;
  isVisbile: boolean = false;
  emojisVisible: boolean = !this.isVisbile;

  constructor(private route: ActivatedRoute, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any, public translate: TranslateService, private blogService: BlogService) {
    translate.addLangs(['es']);// esta página esta solo en español
    // translate.setDefaultLang('es');
    //const browserLang = translate.getBrowserLang();
    /*translate.use(browserLang.match(/es|en/)? browserLang:'es');*/
    this.useLanguage("en");

    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.getDocs();
    this.newsData = this.blogService.getDoc(this.route.snapshot.paramMap.get('id'));
    this.newsData.subscribe((data: newsItem) => {
      if (data != null) {
        console.log(data.content);
        this.content = data.content;
        this.data = data;
      }
    });
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {
    this.useLanguage("en");
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '#meetup',
    });

  }

  rateNews(emoji: string, rating: number) {
    console.log(emoji);
    this.blogService.incrementRating(this.data, rating);
    this.isVisbile = true;
    this.emojisVisible = false;
  }

}
