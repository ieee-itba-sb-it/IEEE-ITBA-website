import {Course, LimitDates} from './course';

export interface CourseWithTests extends Course {
  testDates: LimitDates,
  tests: string[]
}
