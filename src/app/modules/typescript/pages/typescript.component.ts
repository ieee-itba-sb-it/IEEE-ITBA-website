import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typescript',
  templateUrl: './typescript.component.html',
  styleUrls: ['./typescript.component.css']
})
export class TypescriptComponent implements OnInit {

  faq = [
    { q: 'TYPESCRIPT.FAQ.1.QUESTION', a: 'TYPESCRIPT.FAQ.1.ANSWER' },
    { q: 'TYPESCRIPT.FAQ.2.QUESTION', a: 'TYPESCRIPT.FAQ.2.ANSWER' },
    { q: 'TYPESCRIPT.FAQ.3.QUESTION', a: 'TYPESCRIPT.FAQ.3.ANSWER' },
    { q: 'TYPESCRIPT.FAQ.4.QUESTION', a: 'TYPESCRIPT.FAQ.4.ANSWER' },
    { q: 'TYPESCRIPT.FAQ.5.QUESTION', a: 'TYPESCRIPT.FAQ.5.ANSWER' },
    { q: 'TYPESCRIPT.FAQ.6.QUESTION', a: 'TYPESCRIPT.FAQ.6.ANSWER' }
  ];

  schedule = [
    'TYPESCRIPT.SCHEDULE.1', 'TYPESCRIPT.SCHEDULE.2', 'TYPESCRIPT.SCHEDULE.3',
    'TYPESCRIPT.SCHEDULE.4','TYPESCRIPT.SCHEDULE.5','TYPESCRIPT.SCHEDULE.6',
    'TYPESCRIPT.SCHEDULE.7','TYPESCRIPT.SCHEDULE.8','TYPESCRIPT.SCHEDULE.9',
    'TYPESCRIPT.SCHEDULE.10','TYPESCRIPT.SCHEDULE.11','TYPESCRIPT.SCHEDULE.12',
    'TYPESCRIPT.SCHEDULE.13'
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
