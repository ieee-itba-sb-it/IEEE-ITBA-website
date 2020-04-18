import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { newsItem } from '../data-types';
import { Observable } from 'rxjs';
import { blogCollectionName} from '../secrets';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  newsData: Observable<newsItem[]>;

  constructor(private blogService: BlogService) { 
    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.getBlogEntries();
    this.newsData = this.blogService.blogEntriesObs();
  }

  ngOnInit(): void {
  
  }


}
