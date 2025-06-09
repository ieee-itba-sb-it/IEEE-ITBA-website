export interface NewsItem {
  title: string;
  shortIntro: string;
  content: string;
  imageUrl: string;
  author: string;
  reference: string;
  date: Date;
  imageText: string;
  listed: boolean;
  tags: string[];
  ratings: number[];
}

export interface NewsComment {
    userFullname: string;
    userId: string;
    content: string;
    timestamp: Date;
    id: string;
}
