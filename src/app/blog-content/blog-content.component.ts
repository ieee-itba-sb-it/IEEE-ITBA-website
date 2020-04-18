import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { newsItem } from '../data-types';

@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.css']
})
export class BlogContentComponent implements OnInit {
  @Input() blogData: Observable<newsItem>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
