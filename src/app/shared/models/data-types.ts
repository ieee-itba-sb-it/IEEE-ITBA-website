import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

import { IEEEuser } from './ieee-user/ieee-user';
import { roles } from './roles/roles.enum';
import { newsItem } from './news-item/news-item';

export function createNewsItem(
    title: string,
    content: string,
    shortIntro: string,
    imageUrl: string,
    date: Timestamp,
    author: string,
    imageText: string,
    reference: string,
    tags: string[],
    listed: boolean,
    ratings: number[]): newsItem {
    return { title: title, content: content, imageUrl: imageUrl, date: date.toDate(), author: author, reference: reference, imageText: imageText, shortIntro: shortIntro, listed: listed, tags: tags, ratings: ratings }
}

export function createNewsItemWithDate(
    title: string,
    content: string,
    shortIntro: string,
    imageUrl: string,
    date: Date,
    author: string,
    imageText: string,
    reference: string,
    tags: string[],
    listed: boolean,
    ratings: number[]): newsItem {
    return { title: title, content: content, imageUrl: imageUrl, date: date, author: author, reference: reference, imageText: imageText, shortIntro: shortIntro, listed: listed, tags: tags, ratings: ratings }
}

export function createRegularUser(fname: string, lname: string, email: string, photoURL: string, uID: string) {
    var newUser: IEEEuser;
    var role = roles.regularUser
    newUser = { fname, lname, email, photoURL, uID, role };
    return newUser;
}
