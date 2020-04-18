
export interface newsItem{
    title: string;
    content: string;
    photoUrl: string;
    reference: string;
    date: Number;
}

export function createNewsItem(
    title: string, 
    content: string, 
    photoUrl: string,
    date: Number,
    reference: string) : newsItem{
        return {title: title, content: content, photoUrl: photoUrl, date: date, reference: reference}
}