import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { newsItem, createNewsItem } from './data-types';
import { BehaviorSubject } from 'rxjs';
import { create } from 'domain';

/* This file make interface with databe to get blog data */

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  blogData: BehaviorSubject<newsItem[]> = new BehaviorSubject([]);

  constructor(private afs: AngularFirestore) { }

  getBlogEntries(collectionName: string){ /* Program ask to update blog content in main page */
    this.afs.collection(collectionName).get().subscribe(data => {
        var ans : newsItem[] = [];

        for (const blogEntry in data.docs){
          var doc = data[blogEntry].doc;
          
          // Add the next blog item
          ans.push(
            createNewsItem(
              doc["title"],
              doc["content"],
              doc["photo-url"],
              doc["date"],
              doc["reference"]
            )
          )
        }
        // update observer
        this.blogData.next(ans);
    });
  }

  addBlogEntry(collectionName: string, news: newsItem){

    this.afs.collection(collectionName).doc(news.reference).update(news).then(data => {
      console.log("News item added");
    })
  }
  
}
