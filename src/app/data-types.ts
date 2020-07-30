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
    listed: boolean;
}

export enum roles{
    regularUser,
    admin
}

export interface IEEEuser{
    fname: string;
    lname: string;
    email: string;
    photoURL: string;
    uID: string;
    role: number;
}

export function createNewsItem(
    title: string, 
    content: string, 
    shortIntro: string,
    imageUrl: string,
    date: Timestamp,
    author: string,
    imageText: string,
    reference: string,
    listed: boolean) : newsItem{
        return {title: title, content: content, imageUrl: imageUrl, date: date.toDate(), author: author, reference: reference, imageText: imageText, shortIntro: shortIntro, listed: listed}
}

export function createRegularUser(fname: string, lname: string, email: string, photoURL: string, uID: string) {
    var newUser : IEEEuser;
    var role = roles.regularUser
    newUser = {fname,lname,email,photoURL,uID,role};
    return newUser;
}