
export interface newsItem{
    title: string;
    content: string;
    imageUrl: string;
    author: string;
    reference: string;
    date: Number;
}

export function createNewsItem(
    title: string, 
    content: string, 
    imageUrl: string,
    date: Number,
    author: string,
    reference: string) : newsItem{
        return {title: title, content: content, imageUrl: imageUrl, date: date, author: author, reference: reference}
}