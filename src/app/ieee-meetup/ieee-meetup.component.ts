import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-ieee-meetup',
  templateUrl: './ieee-meetup.component.html',
  styleUrls: ['./ieee-meetup.component.css']
})
export class IeeeMeetupComponent implements OnInit {

  constructor(private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any, public translate: TranslateService) {
    translate.addLangs(['es']);// esta página esta solo en español
   // translate.setDefaultLang('es');
    //const browserLang = translate.getBrowserLang();
    /*translate.use(browserLang.match(/es|en/)? browserLang:'es');*/
     
    this.useLanguage("en");

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
