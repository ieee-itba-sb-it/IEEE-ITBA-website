import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NewsItem } from '../../../shared/models/news-item/news-item';
import { createNewsItem, createNewsItemWithDate } from '../../../shared/models/data-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { metadataCollectionName } from '../../../secrets';
import firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import Timestamp = firebase.firestore.Timestamp;

/* This file make interface with databe to get blog data */

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // ----------Variables----------
  blogData: BehaviorSubject<NewsItem[]> = new BehaviorSubject([]);
  docData: BehaviorSubject<{}> = new BehaviorSubject({});
  collectionName: string;

  docsSize: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  listedDocsSize: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  docsPageSize = 10;

  constructor(private afs: AngularFirestore) { }

  // ----------Methods----------

  // Setting collection to use
  setCollectionName(collectionName: string) {
    this.collectionName = collectionName;
  }

  setDocsPageSize(docsPageSize: number) {
    this.docsPageSize = docsPageSize;
  }

  // Delete doc from setted collection
  deleteDoc(name: string) {
    const call = new BehaviorSubject<boolean>(false);
    this.afs.collection(this.collectionName).doc(name).delete().then(data => {
      call.next(true);
      // TODO: Test this
      this.afs.collection(metadataCollectionName).doc(this.collectionName).update({
        count: firebase.firestore.FieldValue.increment(-1),
        extra: {
          listedCount: firebase.firestore.FieldValue.increment(-1)
        }
      });
    });
    return call.asObservable();
  }

  // Gets all docs from setted collection
  getDocs() {
    this.afs.collection(this.collectionName).get().subscribe(data => {
      const ans: NewsItem[] = [];

      for (const blogEntry in data.docs) {
        if (data.docs.hasOwnProperty(blogEntry)) {
          const doc = data.docs[blogEntry].data();
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
      }

      // update observer
      this.blogData.next(ans);
    });
  }



  getRecommendedNews(currentNewsDate: Date): Observable<NewsItem[]> {
    return this.afs.collection<NewsItem>(this.collectionName, ref => ref
      .where('date', '!=', Timestamp.fromDate(currentNewsDate))
      .orderBy('date', 'desc')
      .limit(2)
    ).valueChanges().pipe(
      map(data => {
        const ans: NewsItem[] = [];

        for (const blogEntry in data) {
          if (data.hasOwnProperty(blogEntry)) {
            const doc = data[blogEntry];
            ans.push(createNewsItemWithDate(
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
              doc.ratings
            ));
          }
        }

        return ans;
      })
    );
  }


retrieveDocsSize() {
    this.afs.collection(metadataCollectionName).doc(this.collectionName).get().subscribe(doc => {
      this.docsSize.next(doc.data().count);
    });
  }

  retrieveListedDocsSize() {
    this.afs.collection(metadataCollectionName).doc(this.collectionName).get().subscribe(doc => {
      this.listedDocsSize.next(doc.data().extra.listedCount);
    });
  }

  private getDocsPage(collection: AngularFirestoreCollection){
    collection.get().subscribe(data => {
      const ans: NewsItem[] = [];

      for (const blogEntry in data.docs) {
        // If used because of linter error, else it's 'useless':
        // https://stackoverflow.com/questions/40770425/tslint-codelyzer-ng-lint-error-for-in-statements-must-be-filtere
        if (data.docs.hasOwnProperty(blogEntry)) {
          const doc = data.docs[blogEntry].data();
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
      }
      // update observer
      this.blogData.next(ans);

    });
  }

  getNextDocsPage() {
    const collection = this.afs.collection(this.collectionName, ref => ref
      .orderBy('date', 'desc')
      .startAt(this.blogData.getValue().pop().date)
      .limit(this.docsPageSize));
    this.getDocsPage(collection);
  }

  getPrevDocsPage() {
    const collection = this.afs.collection(this.collectionName, ref => ref
      .orderBy('date', 'desc')
      .endAt(this.blogData.getValue().reverse().pop().date)
      .limitToLast(this.docsPageSize));
    this.getDocsPage(collection);
  }

  // Gets all docs from setted collection
  getFirstDocsPage() {
    const collection = this.afs.collection(this.collectionName, ref => ref
      .orderBy('date', 'desc')
      .limit(this.docsPageSize));
    this.getDocsPage(collection);
  }

  // Sets a doc inside a collection
  setDoc(content: NewsItem) {
    const call = new BehaviorSubject<boolean>(false);

    this.afs.collection(this.collectionName).doc(content.reference).set(content).then(data => {
      call.next(true);
    }
    );


    return call.asObservable();
  }

  // Get a single doc from a collection
  getDoc(name: string): Observable<NewsItem> {
    const ans: BehaviorSubject<NewsItem> = new BehaviorSubject(null);

    this.afs.collection(this.collectionName).doc(name).get().subscribe(data => {
      const doc = data.data();

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
  getNDoc(n: number): Observable<NewsItem> {
    const ans: BehaviorSubject<NewsItem> = new BehaviorSubject(null);

    this.blogData.subscribe(data => {
      const doc = data[0];

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
          doc.listed,
          doc.tags,
          doc.ratings
        )
      );


    });

    return ans.asObservable();
  }

  // Adds doc to setted collection
  addDoc(news: NewsItem) {
    this.afs.collection(this.collectionName).doc(news.reference).update(news).then(data => {
      this.afs.collection(metadataCollectionName).doc(this.collectionName).update({
        count: firebase.firestore.FieldValue.increment(1),
        extra: {
          listedCount: firebase.firestore.FieldValue.increment(1)
        }
      });
    });
  }

  // Deletes doc from given instance
  deleteDocObj(news: NewsItem) {
    this.afs.collection(this.collectionName).doc(news.reference).delete().then(data => {
      this.afs.collection(metadataCollectionName).doc(this.collectionName).update({
        count: firebase.firestore.FieldValue.increment(-1),
        extra: {
          listedCount: firebase.firestore.FieldValue.increment(-1)
        }
      });
    });
  }

  // Gets a collection observable
  docsObs(): Observable<NewsItem[]> {
    return this.blogData.asObservable();
  }

  listedDocsSizeObs(): Observable<number> {
    return this.listedDocsSize.asObservable();
  }

  incrementRating(news: NewsItem, rating: number) {
    const aux: number[] = news.ratings;
    aux[rating]++;
    this.afs.collection(this.collectionName).doc(news.reference).update({
      ratings: aux
    });
  }

}
