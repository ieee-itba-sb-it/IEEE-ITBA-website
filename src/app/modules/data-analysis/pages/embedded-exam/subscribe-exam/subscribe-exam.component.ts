import {Component, OnInit} from "@angular/core";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {EventService} from 'src/app/core/services/event/event.service';
import {AuthService} from 'src/app/core/services/authorization/auth.service';
import {IEEEuser} from "../../../../../shared/models/ieee-user/ieee-user";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";

@Component({
    selector: 'app-subscribe-exam',
    templateUrl: './subscribe-exam.component.html',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatCardModule,
        MatInputModule
    ],
    styleUrls: ['./subscribe-exam.component.css']
})
export class SubscribeExamComponent implements OnInit {
    today = new Date().toLocaleString('es-AR');
    user: IEEEuser | null = null;

    constructor(
        private eventService: EventService,
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.authService.getCurrentUser()
            .pipe(take(1))
            .subscribe(user => {
                if (!user) {
                    this.router.navigate(['/login']).then();
                    return;
                }
                this.user = user;
            });
    }

    enroll() {
        if (!this.user) return;

        this.eventService.enrollUserInDataAnalysis(this.user)
            .subscribe(() => {
                this.router.navigate(['/data-analysis/exams']).then();
            });
    }
}
