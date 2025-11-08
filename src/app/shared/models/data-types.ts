import firebase from 'firebase/compat/app';

import { IEEEuser } from './ieee-user/ieee-user';
import { roles } from './roles/roles.enum';
import { NewsItem } from './news-item/news-item';
import {Timestamp} from "@angular/fire/firestore";

export function createNewsItem(
    title: string,
    content: string,
    imageUrl: string,
    date: Timestamp,
    author: string,
    reference: string,
    listed: boolean,
    tags: string[],
    ratings: number[]): NewsItem {
    return { title, content, imageUrl, date: parseTimestamp(date), author, reference, listed, tags, ratings };
}

const parseTimestamp = (date: Date | Timestamp | { _seconds: number, _nanoseconds: number }): Date => {
    if (date instanceof Date) return date;
    if (date instanceof Timestamp) return date.toDate();
    if (date && typeof date === 'object' && '_seconds' in date && '_nanoseconds' in date) {
        return new Date(date._seconds * 1000 + date._nanoseconds / 1000000);
    }
    return new Date();
}

export function createNewsItemWithDate(
    title: string,
    content: string,
    imageUrl: string,
    date: Date,
    author: string,
    reference: string,
    listed: boolean,
    tags: string[],
    ratings: number[]): NewsItem {
    return { title, content, imageUrl, date, author, reference, listed, tags, ratings };
}

export function createNewsComments(userId: string, userFullname: string, content: string, timestamp: Date, id: string) {
    return { userId, userFullname, content, timestamp, id };
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

export type GenderInternationalText = {
    M: InternationalText;
    F: InternationalText;
}
