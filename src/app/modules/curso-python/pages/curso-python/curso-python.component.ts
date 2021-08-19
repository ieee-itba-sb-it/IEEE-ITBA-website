/*IMPORTS*/
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-curso-python',
  templateUrl: './curso-python.component.html',
  styleUrls: ['./curso-python.component.css']
})
export class CursoPythonComponent implements OnInit {

  //ojala no tuviera que hardcodear asi, pero no encontre una forma de pasarle el string y concatenarlo con otros en el translate
  faq = [
    {q:'PYTHONCOURSES.FAQ.1.QUESTION', a:'PYTHONCOURSES.FAQ.1.ANSWER'},
    {q:'PYTHONCOURSES.FAQ.2.QUESTION', a:'PYTHONCOURSES.FAQ.2.ANSWER'},
    {q:'PYTHONCOURSES.FAQ.3.QUESTION', a:'PYTHONCOURSES.FAQ.3.ANSWER'},
    {q:'PYTHONCOURSES.FAQ.4.QUESTION', a:'PYTHONCOURSES.FAQ.4.ANSWER'},
    {q:'PYTHONCOURSES.FAQ.5.QUESTION', a:'PYTHONCOURSES.FAQ.5.ANSWER'},
  ]
  constructor(public translate: TranslateService) {
    scroll(0,0);
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
