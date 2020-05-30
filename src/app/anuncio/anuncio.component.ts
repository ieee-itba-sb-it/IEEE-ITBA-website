import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { blogCollectionName} from '../secrets';
import { Observable } from 'rxjs';
import { newsItem } from '../data-types';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.component.html',
  styleUrls: ['./anuncio.component.css']
})
export class AnuncioComponent implements OnInit {
  newsData: Observable<newsItem>;

  constructor(private route: ActivatedRoute, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any, public translate: TranslateService, private blogService: BlogService) {
    translate.addLangs(['es']);// esta página esta solo en español
   // translate.setDefaultLang('es');
    //const browserLang = translate.getBrowserLang();
    /*translate.use(browserLang.match(/es|en/)? browserLang:'es');*/
     
    this.useLanguage("en");

    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.getBlogEntries();
    this.newsData = this.blogService.getBlogEntry(this.route.snapshot.paramMap.get('id'));

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

}
