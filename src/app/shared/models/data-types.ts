import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

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
    listed: boolean,
    tags: string[],
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
    listed: boolean,
    tags: string[],
    ratings: number[]): NewsItem {
    return { title, content, imageUrl, date, author, reference, imageText, shortIntro, listed, tags, ratings };
}

export function createRegularUser(fullname: string, email: string, photoURL: string, roles: number[], uID: string, verifiedEmail?: boolean, linkedin?: string) {
    let newUser: IEEEuser;
    if (!linkedin) linkedin = null;
    newUser = { fullname, email, photoURL, uID, roles, linkedin };
    if (verifiedEmail) newUser.verifiedEmail = verifiedEmail;
    return newUser;
}

export type ApiResponse = {
  success: boolean;
  message: string;
};

export type InternationalText = {
  es: string;
  en: string;
}
