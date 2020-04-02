/*IMPORTS*/
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-curso-python',
  templateUrl: './curso-python.component.html',
  styleUrls: ['./curso-python.component.css']
})
export class CursoPythonComponent implements OnInit {

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
