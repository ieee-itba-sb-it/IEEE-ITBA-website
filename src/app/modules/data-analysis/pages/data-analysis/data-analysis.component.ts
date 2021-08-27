import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {

  faq = [
    {q: 'DATAANALYSIS.FAQ.1.QUESTION', a: 'DATAANALYSIS.FAQ.1.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.2.QUESTION', a: 'DATAANALYSIS.FAQ.2.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.3.QUESTION', a: 'DATAANALYSIS.FAQ.3.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.4.QUESTION', a: 'DATAANALYSIS.FAQ.4.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.5.QUESTION', a: 'DATAANALYSIS.FAQ.5.ANSWER'},
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
