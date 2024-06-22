export enum IeeeEvent {
    IEEE_EXTREME = "IEEE_EXTREME",
    PYTHON_COURSE = "PYTHON_COURSE",
    BITCUP = "BITCUP",
    DATA_ANALYSIS = "DATA_ANALYSIS",
    ASIMOV_CUP = "ASIMOV_CUP",
    IOT_WORKSHOP = "IOT_WORKSHOP",
    TYPESCRIPT_COURSE = "TYPESCRIPT_COURSE",
}

export enum EventStatus {
    UNSCHEDULED = "UNSCHEDULED",    // The event has not been scheduled yet
    UPCOMING = "UPCOMING",          // The event is scheduled to occur during the year
    TENTATIVE = "TENTATIVE",        // The event has a tentative month and year, but no specific date
    CONFIRMED = "CONFIRMED",        // The event has a confirmed date
}

export enum EventDate {
    INSCRIPTION = "INSCRIPTION",
    EVENT = "EVENT",
}

const EventDateByPriority: Record<EventDate, number> = {
    INSCRIPTION: 1,
    EVENT: 2,
};

export const sortedEventDates = Object.entries(EventDateByPriority)
    .sort(([_, prio1], [__, prio2]) => prio1 - prio2)
    .map(([date, _]) => date as EventDate);

export type ConfirmedDateEvent = {
    status: EventStatus.CONFIRMED;
    date: Date;
} & ({
    lastDate: Date;
    isPeriod: true;
} | {
    isPeriod: false;
});

export type Event = {
    readonly id: IeeeEvent;
    readonly routerLink: string;
    readonly imageSrc: string;
    readonly imageAlt: string;
    readonly titleCode: string;
    readonly descriptionCode: string;
    readonly isRasEvent: boolean;
    readonly dates: Record<EventDate, ConfirmedDateEvent | {
        status: EventStatus.TENTATIVE;
        month: number;
    } | {
        status: EventStatus.UPCOMING;
        year: number;
    } | {
        status: EventStatus.UNSCHEDULED;
    }>;
}

export type EventDoc = Omit<Event, 'dates'> & {
    dates: Record<EventDate, {
        status: EventStatus.CONFIRMED;
        date: `${number}-${number}-${number}`;
        lastDate?: `${number}-${number}-${number}`;
    } | {
        status: EventStatus.TENTATIVE;
        month: number;
    } | {
        status: EventStatus.UPCOMING;
        year: number;
    } | {
        status: EventStatus.UNSCHEDULED;
    }>;
};
