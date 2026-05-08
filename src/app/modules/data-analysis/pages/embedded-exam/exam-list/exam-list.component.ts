import {Component, OnInit} from "@angular/core";
import {UserExam} from "src/app/shared/models/event/data_analysis/exams";
import {filter, take} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";
import {EventService} from 'src/app/core/services/event/event.service';
import {AuthService} from 'src/app/core/services/authorization/auth.service';
import {IEEEuser} from "../../../../../shared/models/ieee-user/ieee-user";

interface Exam {
    id: number;
    title: string;
    available: boolean;
    attempts: number;
    passed: boolean;
}

@Component({
    selector: "app-exam-list",
    templateUrl: "./exam-list.component.html",
    styleUrls: ["./exam-list.component.css"]
})

export class ExamListComponent implements OnInit {
    questionCant = 3;
    exams: Exam[] = [
        {id: 1, title: 'Día 1', available: true, attempts: 1, passed: false},
        {id: 2, title: 'Día 2', available: true, attempts: 2, passed: false},
        {id: 3, title: 'Día 3', available: true, attempts: 1, passed: false},
        {id: 4, title: 'Día 4', available: true, attempts: 0, passed: false},
        {id: 5, title: 'Día 5', available: false, attempts: 0, passed: false},
        {id: 6, title: 'Día 6', available: false, attempts: 0, passed: false},
        {id: 7, title: 'Día 7', available: false, attempts: 0, passed: false}
    ];

    constructor(
        private eventService: EventService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    startExam(examId: number) {
        this.authService.getCurrentUser().pipe(
            filter(user => user !== null),
            take(1)
        ).subscribe(user => {
            this.eventService.generateExam(this.questionCant, user).subscribe(() => {
                this.router.navigate([examId], {relativeTo: this.route}).then(() => {
                });
            });
        });
    }
    userExam:UserExam|null = null
    ngOnInit() {
        this.authService.getCurrentUser().pipe(
            filter((user): user is IEEEuser => user !== null),
            take(1)
        ).subscribe(user => {
            this.eventService.getUserExam(user).subscribe(exam => {
                this.userExam = exam;
            });
        });
    }

    isReviewAvailable(): boolean {
        if (!this.userExam) return false;
        return this.eventService.isReviewAvailable(this.userExam);
    }

}

