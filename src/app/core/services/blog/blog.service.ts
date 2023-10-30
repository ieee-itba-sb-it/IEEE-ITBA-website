import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentSnapshot} from '@angular/fire/compat/firestore';
// import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NewsItem } from '../../../shared/models/news-item/news-item';
import { createNewsItem, createNewsItemWithDate } from '../../../shared/models/data-types';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { metadataCollectionName } from '../../../secrets';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

/* This file make interface with databe to get blog data */

// TODO: refactor
@Injectable({
    providedIn: 'root'
})
export class BlogService {

    // ----------Variables----------
    blogData: BehaviorSubject<NewsItem[]> = new BehaviorSubject([]);
    docData: BehaviorSubject<{}> = new BehaviorSubject({});
    docsTags: BehaviorSubject<[]> = new BehaviorSubject([]);
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
        const toDeleteDoc = this.afs.collection(this.collectionName).doc(name);
        toDeleteDoc.get().subscribe(snapshot => {
            if (snapshot.exists) {
                toDeleteDoc.delete().then(async () => {
                    await this.afs.collection(metadataCollectionName).doc(this.collectionName).update({
                        count: firebase.firestore.FieldValue.increment(-1),
                        'extra.listedCount': (snapshot.data() as NewsItem).listed ?
                            firebase.firestore.FieldValue.increment(-1) : firebase.firestore.FieldValue.increment(0),
                    });
                    call.next(true);
                });
            }
        });
        return call.asObservable();
    }

    // Gets all docs from setted collection
    getDocs() {
        this.afs.collection(this.collectionName).get().subscribe(data => {
            const ans: NewsItem[] = [];

            for (const blogEntry in data.docs) {
                if (data.docs.hasOwnProperty(blogEntry)) {
                    const doc = data.docs[blogEntry].data() as NewsItem;
                    // Add the next blog item
                    ans.push(
                        createNewsItem(
                            doc.title,
                            doc.content,
                            doc.shortIntro,
                            doc.imageUrl,
                            // @ts-ignore
                            doc.date,
                            doc.author,
                            doc.imageText,
                            doc.reference,
                            doc.listed,
                            doc.tags,
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
            .limit(10)
        ).valueChanges().pipe(
            map(data => (data.map(doc => (
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
            )).sort(() => 0.5 - Math.random()).slice(0, 2)))
        );

    }

    /*
  data => {
        const ans: NewsItem[] = [];

        // Convert data to array of NewsItems
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

        // Randomly select 2 items from the 10 news
        const shuffled = ans.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2); // Get sub-array of first 2 elements after shuffled
      }
   */


    retrieveDocsSize() {
        this.afs.collection(metadataCollectionName).doc(this.collectionName).get().subscribe(doc => {
            // @ts-ignore
            this.docsSize.next(doc.data().count);
        });
    }

    retrieveListedDocsSize() {
        this.afs.collection(metadataCollectionName).doc(this.collectionName).get().subscribe(doc => {
            // @ts-ignore
            this.listedDocsSize.next(doc.data().extra.listedCount);
        });
    }

    getDocsTagsAsObservable() {
        this.afs.collection(metadataCollectionName).doc(this.collectionName).get().subscribe(doc => {
            // @ts-ignore
            this.docsTags.next(doc.data().extra.tags);
        });
        return this.docsTags.asObservable();
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
                            doc.listed,
                            doc.tags,
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
  getFirstDocsPage(cursor?: Date, tags?: string[]) {
    const collection = this.afs.collection(this.collectionName, r => {
      let ref = r
      .orderBy('date', 'desc')
      .limit(this.docsPageSize);
      if (tags && tags.length > 0) ref = ref.orderBy('tags').where('tags', 'array-contains-any', tags);
      if (cursor) ref = ref.startAt(cursor);
      return ref;
    });
    this.getDocsPage(collection);
  }

    // Sets a doc inside a collection and updates metadata
    setDoc(content: NewsItem) {
        const call = new BehaviorSubject<boolean>(false);
        const document = this.afs.collection(this.collectionName).doc(content.reference);
        document.get().subscribe(async (snapshot: DocumentSnapshot<NewsItem>) => {
            const metadataDoc = this.afs.collection(metadataCollectionName).doc(this.collectionName);
            const parallelPromises = [document.set(content)];
            if (!snapshot.exists) {
                parallelPromises.push(metadataDoc.update({
                    count: firebase.firestore.FieldValue.increment(1),
                    'extra.listedCount': firebase.firestore.FieldValue.increment(content.listed ? 1 : 0)
                }));
            } else {
                parallelPromises.push(metadataDoc.update({
                    'extra.listedCount': firebase.firestore.FieldValue.increment(content.listed ? 1 : -1)
                }));
            }
            await Promise.all(parallelPromises);
            call.next(true);
        });

        return call.asObservable();
    }

    // Get a single doc from a collection
    getDoc(name: string): Observable<NewsItem> {
        return this.afs.collection(this.collectionName)
            .doc<NewsItem>(name)
            .get()
            .pipe(
                map(document => (document.data())),
                map(newsItem => (
                    createNewsItem(
                        newsItem.title,
                        newsItem.content,
                        newsItem.shortIntro,
                        newsItem.imageUrl,
                        // @ts-ignore
                        newsItem.date,
                        newsItem.author,
                        newsItem.imageText,
                        newsItem.reference,
                        newsItem.listed,
                        newsItem.tags,
                        newsItem.ratings,
                    )
                )));
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
        return of(news);
    }

}
