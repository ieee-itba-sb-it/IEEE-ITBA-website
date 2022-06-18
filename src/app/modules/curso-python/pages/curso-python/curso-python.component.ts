/*IMPORTS*/
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
@Component({
  selector: 'app-curso-python',
  templateUrl: './curso-python.component.html',
  styleUrls: ['./curso-python.component.css']
})
export class CursoPythonComponent implements OnInit {


  class1Open: boolean = false;
  class2Open: boolean = false;
  class3Open: boolean = false;
  solution3Open: boolean = false;

  //ojala no tuviera que hardcodear asi, pero no encontre una forma de pasarle el string y concatenarlo con otros en el translate
  faq = [
    {q:'PYTHONCOURSES.FAQ.1.QUESTION', a:'PYTHONCOURSES.FAQ.1.ANSWER'},
    {q:'PYTHONCOURSES.FAQ.2.QUESTION', a:'PYTHONCOURSES.FAQ.2.ANSWER'},
    {q:'PYTHONCOURSES.FAQ.3.QUESTION', a:'PYTHONCOURSES.FAQ.3.ANSWER'},
    {q:'PYTHONCOURSES.FAQ.4.QUESTION', a:'PYTHONCOURSES.FAQ.4.ANSWER'},
    {q:'PYTHONCOURSES.FAQ.5.QUESTION', a:'PYTHONCOURSES.FAQ.5.ANSWER'},
  ]

  tyc = [
    {title:'TYC.SUBTITLES.1.TITLE',text:'TYC.SUBTITLES.1.TEXT'},
    {title:'TYC.SUBTITLES.2.TITLE',text:'TYC.SUBTITLES.2.TEXT'},
    {title:'TYC.SUBTITLES.3.TITLE',text:'TYC.SUBTITLES.3.TEXT'},
    {title:'TYC.SUBTITLES.4.TITLE',text:'TYC.SUBTITLES.4.TEXT'},
  ]

  getDate () {

  }

  isOldDate(date: string){
    this.getDate()
    let oldDate = Timestamp.fromDate(new Date(date));
    let now = firebase.firestore.Timestamp.now()
    return now > oldDate ;
  }

  constructor(public translate: TranslateService) {
    scroll(0, 0);
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/)? browserLang:'en');
    this.class1Open = this.isOldDate('31 Apr 2022 14:00:00 UTC');
    this.class2Open = this.isOldDate('08 May 2022 03:00:00 UTC');
    this.class3Open = this.isOldDate('15 May 2022 03:00:00 UTC');
    this.solution3Open = this.isOldDate('22 May 2022 03:00:00 UTC');
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {
  }

}
