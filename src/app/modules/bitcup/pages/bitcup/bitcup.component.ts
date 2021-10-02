import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-bitcup',
  templateUrl: './bitcup.component.html',
  styleUrls: ['./bitcup.component.css']
})
export class BitcupComponent implements OnInit {

  constructor(public translate: TranslateService) 
  { 
    scroll(0, 0);
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/) ? browserLang : 'en');
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {
  }

}
