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
  readonly id: IeeeEvent;
  readonly routerLink: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly titleCode: string;
  readonly descriptionCode: string;
  dates: EventDate[];
  readonly isRasEvent: boolean;
}

export interface EventDate {
  date: Date;
  readonly descriptionCode: string;
  readonly showMonth?: boolean;
  readonly showYear?: boolean;
}
