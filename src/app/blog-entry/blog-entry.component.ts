import { Component, OnInit, Input } from '@angular/core';
import { newsItem } from '../data-types';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.css']
})
export class BlogEntryComponent implements OnInit {
  @Input() newsItem: newsItem;

  constructor() { }

  ngOnInit(): void {
  }

}
