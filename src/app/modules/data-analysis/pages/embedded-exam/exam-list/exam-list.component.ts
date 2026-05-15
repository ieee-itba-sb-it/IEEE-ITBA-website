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
    passed: boolean;
    submitted: boolean;
}

@Component({
    selector: "app-exam-list",
    templateUrl: "./exam-list.component.html",
    styleUrls: ["./exam-list.component.css"]
})

export class ExamListComponent implements OnInit {
    exams: Exam[];

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
            this.router.navigate([examId], {relativeTo: this.route}).then(() => {
            });
        });
    }

    userExam: UserExam | null = null
    currentDay: number = 1

    ngOnInit() {
        this.authService.getCurrentUser().pipe(
            filter((user): user is IEEEuser => user !== null),
            take(1)
        ).subscribe(user => {
            this.eventService.getDataAnalysisStartDate().subscribe(startDate => {
                if (!startDate) return;

                const currentDay = this.eventService.calculateExamDay(startDate);
                this.currentDay = currentDay;

                this.eventService.getUserExam(user).subscribe(exam => {
                    this.userExam = exam;
                    const passed = exam?.passed ?? false;
                    this.exams = Array.from({length: 7}, (_, i) => {
                        const day = i + 1;
                        return {
                            id: day,
                            title: `Día ${day}`,
                            available: day == currentDay && (!passed || !exam?.submitted),
                            passed: passed && day === currentDay,
                            submitted: day === currentDay && (exam?.submitted ?? false)
                        };
                    });
                });
            });
        });
    }

    isReviewAvailable(): boolean {
        if (!this.userExam) return false;
        return this.eventService.isReviewAvailable(this.userExam);
    }

}

