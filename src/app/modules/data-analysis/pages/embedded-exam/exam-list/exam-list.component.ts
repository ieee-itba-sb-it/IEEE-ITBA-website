import {Component, OnInit} from "@angular/core";
import {DATA_ANALYSIS_EXAM_DAYS, DataAnalysisUser, UserExam} from "src/app/shared/models/event/data_analysis/exams";
import {take} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";
import {EventService} from 'src/app/core/services/event/event.service';
import {AuthService} from 'src/app/core/services/authorization/auth.service';
import {IeeeEvent} from "../../../../../shared/models/event/event";

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
    // Today's exam: one from a previous day already counted for that day
    userExam: UserExam | null = null
    passedCourse = false
    currentDay: number = 1
    loading = true
    dataAnalysisUser: DataAnalysisUser | null = null;
    examStartDate:Date | null = null;
    downloadingCertificate = false;
    certificateDownloadError = false;

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
                        this.router.navigate(['/data-analysis/inscription']).then(() => {});
                        return;
                    }
                    this.dataAnalysisUser = student;
                    // A passed student always sees the certificate, even if the exam dates are no longer set
                    this.passedCourse = student.passedCourse;
                    this.eventService.getEvent(IeeeEvent.DATA_ANALYSIS).subscribe(event => {
                        if (!event || !event.examStartDate) {
                            this.loading = false;
                            return;
                        }
                        this.examStartDate = this.eventService.normalizeDate(event.examStartDate);
                        this.currentDay = this.eventService.calculateExamDay(event.examStartDate);
                        this.userExam = this.eventService.getTodayExam(student);
                        this.buildExamCards(this.userExam);
                        this.loading = false;
                    });
                });
            });
    }

    buildExamCards(exam: UserExam | null) {
        const passed = exam?.passed ?? false;
        const submitted = exam?.submitted ?? false;

        this.exams = Array.from({length: DATA_ANALYSIS_EXAM_DAYS}, (_, i) => {
            const day = i + 1;
            return {
                id: day,
                title: `${day}`,
                available: day === this.currentDay && !this.passedCourse && !submitted,
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

    downloadCertificate() {
        if (!this.dataAnalysisUser || this.downloadingCertificate) return;

        this.downloadingCertificate = true;
        this.certificateDownloadError = false;
        this.eventService.downloadDataAnalysisCertificate(this.dataAnalysisUser).subscribe({
            next: () => this.downloadingCertificate = false,
            error: err => {
                console.error(`downloadDataAnalysisCertificate failed: ${err}`);
                this.downloadingCertificate = false;
                this.certificateDownloadError = true;
            }
        });
    }

    protected goToHome() {
        this.router.navigate(['/data-analysis']).then(() => {})
    }
}

