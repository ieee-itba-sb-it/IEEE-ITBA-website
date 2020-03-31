import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(public translate: TranslateService) {
    translate.addLangs(['en','es']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/)? browserLang:'en');
  }
  useLanguage(language: string) {
    this.translate.use(language);    
  }

  ngOnInit(): void {
  }

}
