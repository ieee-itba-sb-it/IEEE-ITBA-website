import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/blog.service';
import { newsItem } from 'src/app/data-types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-articles-column',
  templateUrl: './articles-column.component.html',
  styleUrls: ['./articles-column.component.css']
})
export class ArticlesColumnComponent implements OnInit {

  //Variables
  newsData: newsItem[];
  docObservable: Observable<newsItem[]>;
  flag: boolean;

  //Adding Service
  constructor(private dbs: BlogService) { 
    this.flag = false;
   }

  ngOnInit(): void {
    this.loadSelectedArts(1,4);
  }

  //Get Content of Main article (most recent)
  loadSelectedArts(start: number, last: number){
    this.docObservable = this.dbs.docsObs();
    this.docObservable.subscribe( (data: newsItem[]) =>{
      var array = [];
      for (var i in data){
        if (data[i].listed){
          array.push(data[i]);
        }
      }

      array.sort( (a:newsItem, b:newsItem) => (a.date.getTime()>b.date.getTime()?-1:1));//sort them

      //start trimming
      var end = array.length - last;
      //Snipping start
      for (var j=0; j<start ;j++){
        array.shift();
      }
      //Snipping end
      for(var v=0; v<end ;v++){
        array.pop();
      }

      this.newsData=array;

    });

  }

  //Add more articles
  addArticles(n: number){
    var m = this.newsData.length+n+1;
    console.log('Loading '+ m +' articles...');
    this.loadSelectedArts(1,m);
  }

  //Just a flag alternator
  alternateflag(){
    this.flag = !this.flag;
  }
  isflagsetted(){
    return this.flag;
  }

}