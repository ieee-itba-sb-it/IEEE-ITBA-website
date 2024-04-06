export enum IeeeEvent {
    IEEE_EXTREME = "IEEE_EXTREME",
    PYTHON_COURSE = "PYTHON_COURSE",
    BITCUP = "BITCUP",
    DATA_ANALYSIS = "DATA_ANALYSIS",
    ASIMOV_CUP = "ASIMOV_CUP",
    IOT_WORKSHOP = "IOT_WORKSHOP",
    TYPESCRIPT_COURSE = "TYPESCRIPT_COURSE",
}

export interface EventCardData {
  id: IeeeEvent;
  routerLink: string;
  imageSrc: string;
  imageAlt: string;
  titleCode: string;
  descriptionCode: string;
  dates: EventDate[];
  isRasEvent: boolean;
}

export interface EventDate {
  date: Date;
  descriptionCode: string;
  showMonth?: boolean;
  showYear?: boolean;
}
