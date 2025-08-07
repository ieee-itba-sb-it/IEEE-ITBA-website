import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {AsimovService} from "../../../../core/services/asimov/asimov.service";
import {Category} from "../../../../shared/models/event/asimov/category";

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
    categories: Category[] = [];
    categories$: Observable<Category[]>;
    newCategoryName: string = '';
    loading = true;

    constructor(private asimovService: AsimovService) {}

    ngOnInit(): void {
        this.categories$ = this.asimovService.getCategories();
        this.categories$.subscribe(cats => {
            this.categories = cats;
            this.loading = false;
        });
    }

    addCategory() {
        if (!this.newCategoryName.trim()) return;
        this.loading = true;
        this.asimovService.addCategory({ name: this.newCategoryName }).subscribe({
            next: (result) => {
                this.categories.push(result);
                this.newCategoryName = '';
                this.loading = false;
            }, error: err => {
                console.error('Error adding category:', err);
                this.loading = false;
            }
        });
    }

    deleteCategory(category: Category) {
        this.loading = true;
        this.asimovService.deleteCategory(category).subscribe({
            next: () => {
                this.categories = this.categories.filter(c => c.id !== category.id);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        })
    }
}
