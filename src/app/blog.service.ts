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
  deleteBlogEntry(name: string){
    var call = new BehaviorSubject<boolean>(false);
    this.afs.collection(this.collectionName).doc(name).delete().then( data => {
      call.next(true);
    });
    return call.asObservable();
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
              doc["shortIntro"],
              doc["imageUrl"],
              doc["date"],
              doc["author"],
              doc["imageText"],
              doc["reference"],
            )
          )
        }
        
        // update observer
        this.blogData.next(ans);
    });
  }
  setBlogEntry(content: newsItem){
    var call = new BehaviorSubject<boolean>(false);

    this.afs.collection(this.collectionName).doc(content.reference).set(content).then( data => {
        call.next(true);
      }
    );
    

    return call.asObservable();
  }

  getBlogEntry(name : string) : Observable<newsItem>{ /* Consiguir un blog entry particular */
    var ans : BehaviorSubject<newsItem> = new BehaviorSubject(null);

    this.afs.collection(this.collectionName).doc(name).get().subscribe(data => {
      var doc = data.data();

      ans.next(
        createNewsItem(
          doc["title"],
          doc["content"],
          doc["shortIntro"],
          doc["imageUrl"],
          doc["date"],
          doc["author"],
          doc["imageText"],
          doc["reference"]
        )
      );
    });

    return ans.asObservable();
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
