export interface EventCardData {
  routerLink: string;
  imageSrc: string;
  imageAlt: string;
  titleCode: string;
  descriptionCode: string;
  dates: EventDate[];
}

export interface EventDate {
  date: Date;
  descriptionCode: string;
  showMonth?: boolean;
  showYear?: boolean;
}
