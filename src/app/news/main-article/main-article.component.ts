import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/blog.service';
import { newsItem, createNewsItem } from './../../data-types'
import { timestamp } from 'rxjs/internal/operators/timestamp';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';

import Timestamp = firestore.Timestamp;

@Component({
  selector: 'app-main-article',
  templateUrl: './main-article.component.html',
  styleUrls: ['./main-article.component.css']
})
export class MainArticleComponent implements OnInit {

  //Variables
  newsData: newsItem;

  //Adding Service
  constructor(private dbs: BlogService) {  }

  ngOnInit(): void {
    this.setMainArticleContent();
  }

  //Get Content of Main article (most recent)
  setMainArticleContent(){
    var docObs = this.dbs.docsObs();
    docObs.subscribe( (data: newsItem[]) =>{
      var array = [];
      for (var i in data){
        if (data[i].listed){
          array.push(data[i]);
        }
      }

      array.sort( (a:newsItem, b:newsItem) => (a.date.getTime()>b.date.getTime()?-1:1));
      this.newsData=array[0]; //first in ordered array
    });

  }

}
