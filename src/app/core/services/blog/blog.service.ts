import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { newsItem } from '../../../shared/models/news-item/news-item';
import { createNewsItem, createNewsItemWithDate } from '../../../shared/models/data-types';
import { BehaviorSubject, Observable } from 'rxjs';

/* This file make interface with databe to get blog data */

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // ----------Variables----------
  blogData: BehaviorSubject<newsItem[]> = new BehaviorSubject([]);
  collectionName: string;

  constructor(private afs: AngularFirestore) { }

  // ----------Methods----------

  // Setting collection to use
  setCollectionName(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Delete doc from setted collecion
  deleteDoc(name: string) {
    const call = new BehaviorSubject<boolean>(false);
    this.afs.collection(this.collectionName).doc(name).delete().then(data => {
      call.next(true);
    });
    return call.asObservable();
  }

  // Gets all docs from setted collection
  getDocs() {
    console.log('Getting Docs...');

    this.afs.collection(this.collectionName).get().subscribe(data => {
      const ans: newsItem[] = [];

      for (const blogEntry in data.docs) {
        const doc: any = data.docs[blogEntry].data();
        // Add the next blog item
        ans.push(
          createNewsItem(
            doc.title,
            doc.content,
            doc.shortIntro,
            doc.imageUrl,
            doc.date,
            doc.author,
            doc.imageText,
            doc.reference,
            doc.tags,
            doc.listed,
            doc.ratings
          )
        );

      }
      console.log('Received docs:');
      console.log(ans);
      // update observer
      this.blogData.next(ans);

    });



  }

  // Sets a doc inside a collection
  setDoc(content: newsItem) {
    const call = new BehaviorSubject<boolean>(false);

    this.afs.collection(this.collectionName).doc(content.reference).set(content).then(data => {
      call.next(true);
    }
    );


    return call.asObservable();
  }

  // Get a single doc from a collection
  getDoc(name: string): Observable<newsItem> {
    const ans: BehaviorSubject<newsItem> = new BehaviorSubject(null);

    this.afs.collection(this.collectionName).doc(name).get().subscribe(data => {
      const doc: any = data.data();

      ans.next(
        createNewsItem(
          doc.title,
          doc.content,
          doc.shortIntro,
          doc.imageUrl,
          doc.date,
          doc.author,
          doc.imageText,
          doc.reference,
          doc.listed,
          doc.tags,
          doc.ratings,
        )
      );
    });

    return ans.asObservable();
  }

  // N in array
  getNDoc(n: number): Observable<newsItem> {
    console.log('Getting ' + n + ' doc...');

    const ans: BehaviorSubject<newsItem> = new BehaviorSubject(null);

    this.blogData.subscribe(data => {
      const doc: any = data[0];

      ans.next(
        createNewsItemWithDate(
          doc.title,
          doc.content,
          doc.shortIntro,
          doc.imageUrl,
          doc.date,
          doc.author,
          doc.imageText,
          doc.reference,
          doc.tags,
          doc.listed,
          doc.ratings
        )
      );


    });

    return ans.asObservable();
  }

  // Adds doc to setted collection
  addDoc(news: newsItem) {
    this.afs.collection(this.collectionName).doc(news.reference).update(news).then(data => {
      console.log(`News item with reference ${news.reference} added`);
    });
  }

  // Deletes doc from given instance
  deleteDocObj(news: newsItem) {
    this.afs.collection(this.collectionName).doc(news.reference).delete().then(data => {
      console.log(`News with reference ${news.reference} deleted`);
    });
  }

  // Gets a collection observable
  docsObs(): Observable<newsItem[]> {
    return this.blogData.asObservable();
  }

  incrementRating(news: newsItem, rating: number) {
    const aux: number[] = news.ratings;
    aux[rating]++;
    this.afs.collection(this.collectionName).doc(news.reference).update({
      ratings: aux
    });
  }

}
