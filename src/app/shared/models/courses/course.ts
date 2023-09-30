export interface Course {
  courseClasses: Classes[],
  enrollLink: string,
  enrollDates: LimitDates,
  endDate: Date,
  daysOpenAfterFinish: number,
  contentCloseDate: Date | null
}

export interface Classes {
  openDate: Date,
  content: string,
  solutions: string,
  description: string
}

export interface LimitDates {
  open: Date,
  close: Date | null
}
