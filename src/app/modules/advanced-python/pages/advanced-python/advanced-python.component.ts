import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-advanced-python',
  templateUrl: './advanced-python.component.html',
  styleUrls: ['./advanced-python.component.css']
})
export class AdvancedPythonComponent implements OnInit {

  faq = [
    {q: 'ADVANCEDPYTHON.FAQ.1.QUESTION', a: 'ADVANCEDPYTHON.FAQ.1.ANSWER'},
    {q: 'ADVANCEDPYTHON.FAQ.2.QUESTION', a: 'ADVANCEDPYTHON.FAQ.2.ANSWER'},
    {q: 'ADVANCEDPYTHON.FAQ.3.QUESTION', a: 'ADVANCEDPYTHON.FAQ.3.ANSWER'},
    {q: 'ADVANCEDPYTHON.FAQ.4.QUESTION', a: 'ADVANCEDPYTHON.FAQ.4.ANSWER'},
    {q: 'ADVANCEDPYTHON.FAQ.5.QUESTION', a: 'ADVANCEDPYTHON.FAQ.5.ANSWER'},
  ];

  constructor(public translate: TranslateService) {
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
