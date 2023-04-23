export interface EventCardData {
  routerLink: string;
  imageSrc: string;
  imageAlt: string;
  titleCode: string;
  descriptionCode: string;
  dates: EventDate[];
}

export interface EventDate {
  date: string;
  descriptionCode: string;
  highlighted: boolean;
}
