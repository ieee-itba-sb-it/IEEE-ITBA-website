import { database } from 'firebase';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface newsItem{
    title: string;
    shortIntro: string;
    content: string;
    imageUrl: string;
    author: string;
    reference: string;
    date: Date ;
    imageText: string;
}

export function createNewsItem(
    title: string, 
    content: string, 
    shortIntro: string,
    imageUrl: string,
    date: Timestamp,
    author: string,
    imageText: string,
    reference: string) : newsItem{
        return {title: title, content: content, imageUrl: imageUrl, date: date.toDate(), author: author, reference: reference, imageText: imageText, shortIntro: shortIntro}
}