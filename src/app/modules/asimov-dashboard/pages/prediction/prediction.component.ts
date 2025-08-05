import {Component, OnInit} from '@angular/core';
import {AsimovService} from "../../../../core/services/asimov/asimov.service";
import {Observable, zip} from "rxjs";
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
    loading: boolean = true;

    firstCategory: Category = null;

    predictions$: Observable<Prediction[]>;
    categories$: Observable<Category[]>;

    constructor(private authService: AuthService, private asimovService: AsimovService, private router: Router) {

    }

    ngOnInit(): void {
        this.loading = true;
        this.authService.getCurrentUser().subscribe(user => {
            this.predictions$ = this.asimovService.getUserPredictions(user.uID);
            this.categories$ = this.asimovService.getCategories();
            zip(this.categories$, this.predictions$).subscribe(([categories, predictions]) => {
                const remainingCategories = categories.filter(c => !predictions.find(p => p.category.id === c.id));
                if (remainingCategories.length > 0) this.firstCategory = remainingCategories[0];
                this.loading = false;
            })
        })
    }

    goToNextCategory() {
        this.router.navigate([`/asimov/prediction/${this.firstCategory.name}`]);
    }
}
