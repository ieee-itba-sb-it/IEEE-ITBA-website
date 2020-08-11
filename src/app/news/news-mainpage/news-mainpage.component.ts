import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/blog.service';

@Component({
  selector: 'app-news-mainpage',
  templateUrl: './news-mainpage.component.html',
  styleUrls: ['./news-mainpage.component.css']
})
export class NewsMainpageComponent implements OnInit {

  //Adding Service
  constructor(private dbs: BlogService) { }

  ngOnInit(): void {
    this.getAllDocs();
  }

  //Get all articles
  getAllDocs(){
    //Setting Collection
    this.dbs.setCollectionName('blog-entries');

    this.dbs.getDocs(); //get docs
  }

}
