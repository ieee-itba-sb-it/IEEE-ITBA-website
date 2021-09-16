import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { blogCollectionName } from '../../../../secrets';
import { Observable } from 'rxjs';
import { newsItem } from '../../../../shared/models/news-item/news-item';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {
  newsData: Observable<newsItem>;
  content = '';
  data: newsItem;
  isVisbile = false;
  emojisVisible: boolean = !this.isVisbile;
  showLoadingSpinner = true;
  cookieValue: string;
  cookieName: string;
  emojisList: string[] = ['thumbsdown', 'confused', 'grin', 'joy', 'heart_eyes'];

  constructor(private route: ActivatedRoute, private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any, public translate: TranslateService,
              private blogService: BlogService, private cookieService: CookieService) {
    translate.addLangs(['es']);
    // esta página esta solo en español
    // translate.setDefaultLang('es');
    // const browserLang = translate.getBrowserLang();
    /*translate.use(browserLang.match(/es|en/)? browserLang:'es');*/
    this.useLanguage('en');

    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.getDocs();
    this.newsData = this.blogService.getDoc(this.route.snapshot.paramMap.get('id'));

    this.newsData.subscribe((data: newsItem) => {
      if (data != null) {
        this.content = data.content;
        this.data = data;
        this.showLoadingSpinner = false;
      }
    });
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {
    this.useLanguage('en');
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '#meetup',
    });
    this.cookieName = `${this.route.snapshot.paramMap.get('id')}-vote`;
    this.cookieValue = this.cookieService.get(this.cookieName);
    if (this.cookieValue !== '') {
      this.isVisbile = true;
      this.emojisVisible = false;
    }

  }

  rateNews(emoji: string, rating: number) {
    if (this.cookieValue === '') {
      this.cookieService.set(this.cookieName, emoji);
      this.blogService.incrementRating(this.data, rating);
      this.isVisbile = true;
      this.emojisVisible = false;
    }
  }

  isSelected(i: number) {
    return this.cookieValue === this.emojisList[i];
  }
}
