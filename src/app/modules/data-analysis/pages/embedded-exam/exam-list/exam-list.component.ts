import {Component, OnInit} from "@angular/core";
import {DataAnalysisUser, UserExam} from "src/app/shared/models/event/data_analysis/exams";
import {take} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";
import {EventService} from 'src/app/core/services/event/event.service';
import {AuthService} from 'src/app/core/services/authorization/auth.service';

interface Exam {
    id: number;
    title: string;
    available: boolean;
    passed: boolean;
    submitted: boolean;
    expired: boolean;
}

@Component({
    selector: "app-exam-list",
    templateUrl: "./exam-list.component.html",
    styleUrls: ["./exam-list.component.css"]
})

export class ExamListComponent implements OnInit {
    exams: Exam[];
    userExam: UserExam | null = null
    currentDay: number = 1
    loading = true
    dataAnalysisUser: DataAnalysisUser | null = null;

    constructor(
        private eventService: EventService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    startExam(examId: number) {
        this.router.navigate(['day', examId], {relativeTo: this.route}).then(() => {
        });
    }

    ngOnInit() {
        this.authService.getCurrentUser().pipe(take(1))
            .subscribe(user => {
                if (!user) {
                    this.router.navigate(['/login']).then(() => {
                    });
                    return;
                }
                this.eventService.getDataAnalysisUser(user).subscribe(student => {
                    if (!student) {
                        this.router.navigate(['/data-analysis/exams/subscribe-exam']).then(() => {
                        });
                        return;
                    }
                    this.dataAnalysisUser = student;
                    this.eventService.getDataAnalysisStartDate().subscribe(startDate => {
                        if (!startDate) {
                            this.loading = false;
                            return;
                        }
                        this.currentDay = this.eventService.calculateExamDay(startDate);
                        const exam = student.currentExam ?? null;
                        this.userExam = exam ?? null;
                        this.buildExamCards(exam);
                        this.loading = false;
                    })
                });
            });
    }

    buildExamCards(exam: UserExam | undefined) {
        const passed = exam?.passed ?? false;
        const submitted = exam?.submitted ?? false;

        this.exams = Array.from({length: 7}, (_, i) => {
            const day = i + 1;
            return {
                id: day,
                title: `${day}`,
                available: day === this.currentDay && (!passed || !exam?.submitted),
                passed: passed && day === this.currentDay,
                submitted: day === this.currentDay && submitted,
                expired: day < this.currentDay
            };
        });
    }

    isReviewAvailable(): boolean {
        if (!this.userExam) return false;
        return this.eventService.isReviewAvailable(this.userExam);
    }

}

