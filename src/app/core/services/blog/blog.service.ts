import { Injectable } from '@angular/core';
import {Firestore, collection, CollectionReference, query, doc, getDoc, deleteDoc, getDocs, where, orderBy, limit, QuerySnapshot, getCountFromServer, startAt, Query, endAt, limitToLast, QueryConstraint, setDoc, addDoc, updateDoc, QueryFieldFilterConstraint, Timestamp, QueryDocumentSnapshot} from '@angular/fire/firestore';
// import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NewsItem } from '../../../shared/models/news-item/news-item';
import { createNewsItem, createNewsItemWithDate } from '../../../shared/models/data-types';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { metadataCollectionName } from '../../../secrets';

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
    collection: CollectionReference;

    docsSize: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    listedDocsSize: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    docsPageSize = 10;

    constructor(private afs: Firestore) { }

    // ----------Methods----------

    // Setting collection to use
    setCollectionName(collectionName: string) {
        this.collectionName = collectionName;
        this.collection = collection(this.afs, collectionName);
    }

    setDocsPageSize(docsPageSize: number) {
        this.docsPageSize = docsPageSize;
    }

    // Delete doc from setted collection
    deleteDoc(name: string) {
        const call = new BehaviorSubject<boolean>(false);
        const toDeleteDoc = doc(this.afs, this.collectionName, name);
        getDoc(toDeleteDoc).then(snap => {
            if (!snap.exists) call.next(false);
            else {
                deleteDoc(toDeleteDoc)
                    .then(res => {call.next(true)})
                    .catch(err => {call.next(false)});
            }
        });
        return call.asObservable();
    }

    // Gets all docs from setted collection
    getDocs() {
        getDocs(query(this.collection)).then(data => {
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
            this.blogData.next(ans);
        });
    }



    getRecommendedNews(currentNewsDate: Date): Observable<NewsItem[]> {
        const call = new BehaviorSubject<NewsItem[]>([]);
        getDocs(query(this.collection,
            where("date", "!=", Timestamp.fromDate(currentNewsDate)),
            orderBy("date", "desc"),
            limit(10)
        )).then(snapshot => {
            const docs = snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data()).map((doc: any) => (
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
            )).sort(() => 0.5 - Math.random()).slice(0, 2);
            call.next(docs);
        });
        return call.asObservable();
    }

    retrieveDocsSize() {
        getCountFromServer(this.collection).then(snap => {
            this.docsSize.next(snap.data().count);
        })
    }

    retrieveListedDocsSize(tags?: string[]) {
        let constraints: QueryFieldFilterConstraint[] = [where('listed', '==', true)];
        if (tags && tags.length > 0) constraints.push(where('tags', 'array-contains-any', tags));
        getCountFromServer(query(this.collection, ...constraints)).then(snap => {
            this.listedDocsSize.next(snap.data().count);
        });
    }

    getDocsTagsAsObservable() {
        getDocs(query(collection(this.afs, metadataCollectionName))).then((snap: QuerySnapshot) => {
            this.docsTags.next(snap.docs[0].data().extra.tags);
        })
        return this.docsTags.asObservable();
    }

    private getDocsPage(query: Query){
        getDocs(query).then(data => {
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

    getNextDocsPage(tags?: string[]) {
        let constraints: QueryConstraint[] = [orderBy('date', 'desc')];
        if (tags && tags.length > 0) constraints.push(orderBy('tags'), where('tags', 'array-contains-any', tags));
        constraints.push(limit(this.docsPageSize), startAt(this.blogData.getValue().pop().date));
        const q = query(this.collection, ...constraints);
        this.getDocsPage(q);
    }

    getPrevDocsPage(tags?: string[]) {
        let constraints: QueryConstraint[] = [orderBy('date', 'desc')];
        if (tags && tags.length > 0) constraints.push(orderBy('tags'), where('tags', 'array-contains-any', tags));
        constraints.push(limitToLast(this.docsPageSize), endAt(this.blogData.getValue().reverse().pop().date));
        const q = query(this.collection, ...constraints);
        this.getDocsPage(q);
    }

  // Gets all docs from setted collection
  getFirstDocsPage(cursor?: Date, tags?: string[]) {
    let constraints: QueryConstraint[] = [orderBy('date', 'desc'), limit(this.docsPageSize)];
    if (tags && tags.length > 0) constraints.push(orderBy('tags'), where('tags', 'array-contains-any', tags));
    if (cursor) constraints.push(startAt(cursor));
    const q = query(this.collection, ...constraints);
    this.getDocsPage(q);
  }

    // Sets a doc inside a collection and updates metadata
    setDoc(content: NewsItem) {
        const call = new BehaviorSubject<boolean>(false);
        const docToSet = doc(this.afs, this.collectionName, content.reference);
        getDoc(docToSet).then(snap => {
            if (!snap.exists) call.next(false);
            else {
                setDoc(docToSet, content)
                    .then(res => {call.next(true)})
                    .catch(err => {call.next(false)})
            }
            call.next(true);
        });
        return call.asObservable();
    }

    // Get a single doc from a collection
    getDoc(name: string): Observable<NewsItem> {
        const call = new BehaviorSubject<NewsItem>(null);
        getDoc(doc(this.afs, this.collectionName, name)).then(snap => {
            const newsItem = snap.data();
            call.next(
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
            );
        });
        return call.asObservable();
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
        const call = new BehaviorSubject<boolean>(false);
        addDoc(this.collection, news)
            .then(res => {call.next(true)})
            .catch(err => {call.next(false)});
        return call.asObservable();
    }

    // Deletes doc from given instance
    deleteDocObj(news: NewsItem) {
        const call = new BehaviorSubject<boolean>(false);
        getDoc(doc(this.afs, this.collectionName, news.reference)).then(snap => {
            if (!snap.exists) call.next(false);
            else {
                deleteDoc(doc(this.afs, this.collectionName, news.reference))
                    .then(res => {call.next(true)})
                    .catch(err => {call.next(false)});
            }
        });
        return call.asObservable();
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
        updateDoc(doc(this.afs, this.collectionName, news.reference), {
            ratings: aux
        })
        return of(news);
    }

}
