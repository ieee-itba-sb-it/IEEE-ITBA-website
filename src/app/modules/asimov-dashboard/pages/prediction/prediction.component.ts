import {Component, OnInit} from '@angular/core';
import {AsimovService} from "../../../../core/services/asimov/asimov.service";
import {BehaviorSubject, Observable, zip} from "rxjs";
import {Prediction} from "../../../../shared/models/event/asimov/score";
import {Category} from "../../../../shared/models/event/asimov/category";
import {AuthService} from "../../../../core/services/authorization/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
    private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    loading$: Observable<boolean> = this.loadingSubject.asObservable();
    firstCategory: Category | null = null;
    openCategories: Category[] = [];
    userPredictions: Prediction[] = [];
    existsClicoUser: boolean = false;

    predictions$: Observable<Prediction[]>;
    categories$: Observable<Category[]>;
    status$: Observable<boolean>;
    clicoUser$: Observable<boolean>;

    readonly CLICO_REF = "https://tryclico.com/";

    constructor(private authService: AuthService, private asimovService: AsimovService, private router: Router) {

    }

    ngOnInit(): void {
        this.loadingSubject.next(true);
        this.status$ = this.asimovService.getPredictionsStatus();
        this.authService.getCurrentUser().subscribe(user => {
            if (user) {
                this.predictions$ = this.asimovService.getUserPredictions(user.uID);
                this.categories$ = this.asimovService.getCategories();
                this.clicoUser$ = this.asimovService.checkClicoUserExists(user);
                zip(this.categories$, this.predictions$, this.clicoUser$).subscribe(([categories, predictions, existsClicoUser]) => {
                    this.existsClicoUser = existsClicoUser
                    this.openCategories = categories.filter(c => c.predictionsOpen);
                    this.userPredictions = predictions;
                    const remainingCategories = this.openCategories.filter(c => !predictions.find(p => p.category.id === c.id));
                    if (remainingCategories.length > 0) this.firstCategory = remainingCategories[0];
                    this.loadingSubject.next(false);
                });
            } else {
                this.loadingSubject.next(false);
            }
        });
    }

    goToNextCategory() {
        if (this.firstCategory) {
            this.router.navigate([`/asimov/prediction/${this.firstCategory.name}`]);
        }
    }

    goToPrediction(category: Category) {
        this.router.navigate([`/asimov/prediction/${category.name}`]);
    }

    hasVoted(category: Category): boolean {
        return this.userPredictions.some(p => p.category.id === category.id);
    }
}
