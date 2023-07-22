import { Component, OnInit, Inject, inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { PageScrollService } from 'ngx-page-scroll-core';
import { TranslateService } from '@ngx-translate/core';
import { browser } from 'protractor';
import { AppConfigService } from './core/services/configuration/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              public translate: TranslateService,
              private appConfigService: AppConfigService) {
    if (translate.getLangs().length === 0) {
      translate.addLangs(['en', 'es']);
      translate.setDefaultLang('en');
      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/es|en/) ? browserLang : 'en');
    }
  }

  title = 'ITBA-IEEE-Website-A9';

  getNavbarColor() {
    return this.appConfigService.getNavbarColor();
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
}
