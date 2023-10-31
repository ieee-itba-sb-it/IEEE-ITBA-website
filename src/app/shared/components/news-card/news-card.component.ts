import { Component, Input, OnInit } from '@angular/core';
import { NewsItem } from '../../models/news-item/news-item';

@Component({
    selector: 'app-news-card',
    templateUrl: './news-card.component.html',
    styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {
  @Input() noticia?: NewsItem;
  @Input() center?: Boolean;
  
  constructor() { }

  ngOnInit(): void {}

}
