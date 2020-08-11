import { Component, OnInit } from '@angular/core';
import { newsItem } from './../../data-types';
@Component({
  selector: 'app-articles-row',
  templateUrl: './articles-row.component.html',
  styleUrls: ['./articles-row.component.css']
})
export class ArticlesRowComponent implements OnInit {

  articles: newsItem[];

  constructor() { }

  ngOnInit(): void {
    
  }

}
