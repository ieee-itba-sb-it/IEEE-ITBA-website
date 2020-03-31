import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { PageScrollService } from 'ngx-page-scroll-core';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-newnavbar',
  templateUrl: './newnavbar.component.html',
  styleUrls: ['./newnavbar.component.css']
})
export class NewnavbarComponent implements OnInit {

  constructor(private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any, public translate: TranslateService) {
    translate.addLangs(['en','es']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/)? browserLang:'en');
  }
  useLanguage(language: string) {
    this.translate.use(language);    
  }
  

  ngOnInit() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '.about-ieee',
    });
  }
  scrollTo(target: string){
    console.log(target);
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: target,
    });
  }

}