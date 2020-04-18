import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { newsItem, createNewsItem } from './data-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { create } from 'domain';
import { blogCollectionName } from './secrets';

/* This file make interface with databe to get blog data */

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  blogData: BehaviorSubject<newsItem[]> = new BehaviorSubject([]);
  collectionName: string;

  constructor(private afs: AngularFirestore) { }

  setCollectionName(collectionName: string){
    this.collectionName = collectionName;
  }

  getBlogEntries(){ /* Program ask to update blog content in main page */
    this.afs.collection(this.collectionName).get().subscribe(data => {

        var ans : newsItem[] = [];

        for (const blogEntry in data.docs){
          var doc = data.docs[blogEntry].data();
          // Add the next blog item
          ans.push(
            createNewsItem(
              doc["title"],
              doc["content"],
              doc["image-url"],
              doc["date"],
              doc["author"],
              doc["reference"]
            )
          )
        }
        // update observer
        this.blogData.next(ans);
    });
  }

  addBlogEntry(news: newsItem){
    this.afs.collection(this.collectionName).doc(news.reference).update(news).then(data => {
      console.log(`News item with reference ${news.reference} added`);
    })
  }
  
  removeBlogEntry(news: newsItem){
    this.afs.collection(this.collectionName).doc(news.reference).delete().then(data => {
      console.log(`News with reference ${news.reference} deleted`);
    })
  }

  blogEntriesObs(): Observable<newsItem[]>{ // get news data observable
    return this.blogData.asObservable();
  }

}
