import { Component, OnInit } from '@angular/core';

import { article } from './article';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {

  articles: article[];

  constructor() { }

  ngOnInit(): void {
  }

}
