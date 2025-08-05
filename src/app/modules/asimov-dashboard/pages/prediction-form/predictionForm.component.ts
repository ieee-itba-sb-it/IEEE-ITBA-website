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
import {Category} from "../../../../shared/models/event/asimov/category";
import { v4 as uuid } from 'uuid';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {zip} from "rxjs";


@Component({
    selector: 'app-prediction-form',
    templateUrl: './predictionForm.component.html',
    standalone: true,
    imports: [
        SharedModule,
        TitleCasePipe,
        NgIf,
        MatIconModule,
        MatButtonModule
    ],
    styleUrls: ['./predictionForm.component.css']
})

export class PredictionFormComponent implements OnInit {

    loading: boolean = true;

    category: Category = null;
    categoryEncounters: Encounter[] = [];
    categoryRobots: Robot[] = [];
    predictions: Prediction[] = [];
    currentUser: IEEEuser | null = null;

    allCategories: Category[];

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private asimovService: AsimovService) {}

    ngOnInit(): void {
        this.asimovService.getCategories().subscribe(categories => {
            this.allCategories = categories;
            this.route.paramMap.subscribe(params => {
                const paramCategory = params.get('categoria');
                const category = this.allCategories.find(c => c.name.toLowerCase() === paramCategory?.toLowerCase());
                if (paramCategory && category) {
                    this.category = category;
                    this.loadCategoryData(category.id);
                } else {
                    this.router.navigate(['/asimov/dashboard']);
                }
            });
        });
    }

    loadCategoryData(categoryId: string) {
        // Limpiar datos previos
        this.categoryRobots = [];
        this.categoryEncounters = [];
        this.predictions = [];

        this.loading = true;

        zip(
            this.authService.getCurrentUser(),
            this.asimovService.getRobotsByCategoryId(categoryId),
            this.asimovService.getEncountersByCategoryId(categoryId)

        ).subscribe(([user, robots, encounters]) => {
            this.categoryRobots = robots;
            this.categoryEncounters = this.completeEncounters(encounters);
            this.currentUser = user;
            this.asimovService.getUserPredictions(user.uID).subscribe(predictions => {
                this.loading = false;
                if (predictions.find(pred => pred.category.id === categoryId)) {
                    this.onNext();
                }
            })
        })
    }

    completeEncounters(encounters: Encounter[]): Encounter[] {
        if (!encounters.length || !this.category) return encounters;

        // Encontrar el nivel máximo (más lejano de la final)
        const maxLevel = Math.max(...encounters.map(e => e.level));

        // Calcular cuántos robots deberían haber en total (debe ser potencia de 2)
        const robotsInMaxLevel = encounters.filter(e => e.level === maxLevel).length * 2;
        const totalLevels = Math.log2(robotsInMaxLevel);

        // Crear un mapa de enfrentamientos existentes
        const existingEncounters = new Map<string, Encounter>();
        encounters.forEach(encounter => {
            const key = `${encounter.level}-${encounter.order}`;
            existingEncounters.set(key, encounter);
        });

        const completeEncountersList: Encounter[] = [...encounters];

        // Rellenar enfrentamientos faltantes desde el nivel actual hasta la final (nivel 0)
        for (let level = maxLevel - 1; level >= 0; level--) {
            const encountersInLevel = Math.pow(2, level);

            for (let order = 0; order < encountersInLevel; order++) {
                const key = `${level}-${order}`;

                if (!existingEncounters.has(key)) {
                    // Crear enfrentamiento vacío
                    const newEncounter: Encounter = {
                        id: uuid(),
                        level: level,
                        order: order,
                        category: this.category,
                        robot1: '', // Vacío hasta que se determine el ganador del nivel anterior
                        robot2: '', // Vacío hasta que se determine el ganador del nivel anterior
                        winner: undefined
                    };

                    completeEncountersList.push(newEncounter);
                    existingEncounters.set(key, newEncounter);
                }
            }
        }

        return completeEncountersList.sort((a, b) => {
            if (a.level !== b.level) return b.level - a.level; // Ordenar por nivel (mayor primero)
            return a.order - b.order; // Luego por orden
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
                id: uuid(),
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
            return '/asimov/prediction/'.concat(siguienteCategoria.name);
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
        if (this.predictions.length === 0) return this.navigateToNext();
        this.asimovService.savePredictions(this.predictions).subscribe({
            next: () => {
                // Redirigir a la siguiente categoría o al dashboard
                console.log("Predicciones guardadas correctamente");
                this.navigateToNext();
            },
            error: (err) => {
                // Manejo de error simple
                alert('Error al guardar predicciones: ' + err);
            }
        });
    }

    navigateToNext() {
        const nextCategory = this.nextCategory();
        this.router.navigate([nextCategory]);
    }
}
