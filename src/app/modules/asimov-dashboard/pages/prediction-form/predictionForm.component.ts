import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Encounter} from "../../../../shared/models/event/asimov/encounter";
import {Robot} from "../../../../shared/models/event/asimov/robot";
import { SharedModule } from "../../../../shared/shared.module";
import {NgIf, TitleCasePipe} from "@angular/common";
import { Prediction } from '../../../../shared/models/event/asimov/score';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import { AsimovService } from 'src/app/core/services/asimov/asimov.service';


@Component({
    selector: 'app-prediction-form',
    templateUrl: './predictionForm.component.html',
    standalone: true,
    imports: [
        SharedModule,
        TitleCasePipe,
        NgIf
    ],
    styleUrls: ['./predictionForm.component.css']
})

export class PredictionFormComponent implements OnInit {
    public category: string = '';
    public categoryEncounters: Encounter[] = [];
    public categoryRobots: Robot[] = [];
    public predictions: Prediction[] = [];
    public currentUser: IEEEuser | null = null;

    allCategories = ['carreras', 'sumo', 'minisumo', 'futbol'];

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private asimovService: AsimovService) {}

    ngOnInit(): void {
        this.authService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
        });
        this.route.paramMap.subscribe(params => {
            const paramCategory = params.get('categoria');
            if (paramCategory && this.allCategories.includes(paramCategory)) {
                this.category = paramCategory;
                this.loadCategoryData(paramCategory);
            } else {
                this.router.navigate(['/asimov/dashboard']);
            }
        });
    }

    loadCategoryData(categoria: string) {
        // Limpiar datos previos
        this.categoryRobots = [];
        this.categoryEncounters = [];
        this.predictions = [];
        this.asimovService.getRobots().subscribe(robots => {
            this.categoryRobots = robots.filter(r => r.category.name.toLowerCase() === categoria.toLowerCase());
        });

        this.asimovService.getEncounters().subscribe(encounters => {
            this.categoryEncounters = encounters.filter(e => e.category.name.toLowerCase() === categoria.toLowerCase());
        });
    }

    handleVote(encounter: any) {
        if (!this.currentUser) return;
        let winnerId = '';
        if (encounter.winner === 1) winnerId = encounter.robot1;
        else if (encounter.winner === 2) winnerId = encounter.robot2;
        else return;

        const idx = this.predictions.findIndex(p => p.level === encounter.level && p.order === encounter.order && p.category.id === encounter.category.id);
        if (idx !== -1) {
            this.predictions[idx].winner = winnerId;
        } else {
            this.predictions.push({
                id: encounter.id.concat(this.currentUser.uID),
                uID: this.currentUser.uID,
                level: encounter.level,
                order: encounter.order,
                category: encounter.category,
                winner: winnerId,
                fullname: this.currentUser.fullname,
            });
        }
    }

    nextCategory():string {
        const actualIndex = this.allCategories.indexOf(this.category);
        const siguienteCategoria = this.allCategories[actualIndex + 1];

        if (siguienteCategoria) {
            return '/asimov/prediction/'.concat(siguienteCategoria);
        } else {
            return '/asimov/dashboard';
        }
    }

    isFinalPredicted(): boolean {
        return this.predictions.length === this.categoryEncounters.length;
    }

    getChampionRobot(): Robot | null {
        const finalEncounter = this.categoryEncounters.find(e => e.level === 0);
        if (!finalEncounter) return null;
        const finalPrediction = this.predictions.find(
            p => p.level === 0 && p.order === finalEncounter.order && p.category.id === finalEncounter.category.id && !!p.winner
        );
        if (!finalPrediction) return null;
        return this.categoryRobots.find(r => r.id === finalPrediction.winner) || null;
    }

    onNext() {
        if (!this.currentUser) return;
        this.asimovService.savePredictions(this.predictions).subscribe({
            next: () => {},
            error: (err) => {
                // Manejo de error simple
                alert('Error al guardar predicciones: ' + err);
            }
        });
    }
}
