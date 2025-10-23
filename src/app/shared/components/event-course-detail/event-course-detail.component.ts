import {Component, Input} from '@angular/core';
import {Event, EventCourseClass, EventDate, EventStatus} from "../../models/event/event";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-event-course-detail',
    templateUrl: './event-course-detail.component.html',
    styleUrls: ['./event-course-detail.component.css']
})
export class EventCourseDetailComponent {

    @Input() event: Event;
    @Input() imageUrl: string;
    @Input() contentButtonCode: string;
    @Input() solutionButtonCode: string;
    @Input() isTitleCodeAPrefix?: boolean = false;

    constructor(private translationService: TranslateService) { }

    private getWeeksOfDifferenceFromDate(date: Date): number {
        const millisInWeek = 1000 * 60 * 60 * 24 * 7;
        const now = new Date();
        const millisDifference = now.getTime() - date.getTime();
        return Math.floor(millisDifference / millisInWeek);
    }

    hasCourse(): boolean {
        return this.event && this.event.course && this.event.course.length > 0;
    }

    hasEnded(): boolean {
        const dates = this.event.dates;
        const eventDate = dates[EventDate.EVENT];
        if (eventDate.status !== EventStatus.CONFIRMED) {
            return true;
        }
        const date = eventDate.date;
        const lastDate = eventDate.isPeriod ? eventDate.lastDate : null;
        if (lastDate) {
            const weeksOfDifference = this.getWeeksOfDifferenceFromDate(lastDate);
            return weeksOfDifference > 0;
        }
        const amountOfClasses = this.event.course.length;
        const weeksOfDifference = this.getWeeksOfDifferenceFromDate(date);
        return weeksOfDifference > amountOfClasses;
    }

    private shouldBeAvailable(classIdx: number, minWeeks: number): boolean {
        if (this.hasEnded() ||
            !this.hasCourse() ||
            classIdx >= this.event.course.length ||
            classIdx < 0 ||
            this.event.dates[EventDate.EVENT].status !== EventStatus.CONFIRMED
        ) {
            return false;
        }
        const date = this.event.dates[EventDate.EVENT].date;
        const weeksOfDifference = this.getWeeksOfDifferenceFromDate(date);
        return weeksOfDifference >= minWeeks;
    }

    shouldClassContentBeAvailable(classIdx: number): boolean {
        return this.shouldBeAvailable(classIdx, classIdx) || this.event.course[classIdx].alwaysAvailable;
    }

    shouldClassSolutionBeAvailable(classIdx: number): boolean {
        return this.shouldBeAvailable(classIdx, classIdx + 1) || this.event.course[classIdx].alwaysAvailable;
    }

    getCourseIndexes(): number[] {
        const length = this.hasCourse() ? this.event.course.length : 0;
        return Array.from({length}, (_, i) => i);
    }

    getClassProperty<P extends keyof EventCourseClass>(classIdx: number, property: P): EventCourseClass[P] {
        if (!this.hasCourse() || classIdx >= this.event.course.length || classIdx < 0) {
            return null;
        }
        return this.event.course[classIdx][property];
    }

    getClassTitle(classIdx: number): string {
        const titleCode = this.getClassProperty(classIdx, 'titleCode');
        const title = this.translationService.instant(titleCode);
        if (!this.isTitleCodeAPrefix) {
            return title;
        }
        const classNumber = classIdx + 1;
        return `${title} ${classNumber}`;
    }

    getClassDescription(classIdx: number): string {
        const descriptionCode = this.getClassProperty(classIdx, 'descriptionCode');
        return this.translationService.instant(descriptionCode);
    }

    getClassContentLink(classIdx: number): string {
        const contentLink = this.getClassProperty(classIdx, 'contentLink');
        return contentLink || '';
    }

    getClassSolutionsLink(classIdx: number): string {
        const solutionsLink = this.getClassProperty(classIdx, 'solutionsLink');
        return solutionsLink || '';
    }

    doesClassHaveActions(classIdx: number): boolean {
        const contentLink = this.getClassContentLink(classIdx);
        const solutionsLink = this.getClassSolutionsLink(classIdx);
        return contentLink.length > 0 || solutionsLink.length > 0;
    }

    check = (event: MouseEvent, isReady: boolean) => {
        if (!isReady) {
            event.preventDefault();
        }
    }

}
