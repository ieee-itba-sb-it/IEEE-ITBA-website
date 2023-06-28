import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

import { IEEEuser } from './ieee-user/ieee-user';
import { roles } from './roles/roles.enum';
import { NewsItem } from './news-item/news-item';

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
    ratings: number[]): NewsItem {
    return { title, content, imageUrl, date: date.toDate(), author, reference, imageText, shortIntro, listed, tags, ratings };
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
    ratings: number[]): NewsItem {
    return { title, content, imageUrl, date, author, reference, imageText, shortIntro, listed, tags, ratings };
}

export function createRegularUser(fname: string, lname: string, email: string, photoURL: string, uID: string) {
    let newUser: IEEEuser;
    const role = roles.regularUser;
    newUser = { fname, lname, email, photoURL, uID, role };
    return newUser;
}

export type ApiResponse = {
  success: boolean;
  message: string;
};
