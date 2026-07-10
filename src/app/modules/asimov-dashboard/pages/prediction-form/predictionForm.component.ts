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
import {Observable, zip} from "rxjs";


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
    alreadyVoted: boolean = false;

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private asimovService: AsimovService) {}

    ngOnInit(): void {
        this.asimovService.getCategories().subscribe(categories => {
            this.allCategories = categories;
            this.route.paramMap.subscribe(params => {
                const paramCategory = params.get('categoria');
                const category = this.allCategories.find(c => c.name.toLowerCase() === paramCategory?.toLowerCase());
                if (paramCategory && category && category.predictionsOpen) {
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
        this.alreadyVoted = false;

        this.loading = true;

        zip(
            this.authService.getCurrentUser(),
            this.asimovService.getRobotsByCategoryId(categoryId),
            this.asimovService.getEncountersByCategoryId(categoryId)

        ).subscribe(([user, robots, encounters]) => {
            this.categoryRobots = robots;
            this.categoryEncounters = this.completeEncounters(encounters);
            this.currentUser = user;
            if (encounters.length < 1) {
                this.loading = false;
                return this.onNext();
            }
            this.asimovService.getUserPredictions(user.uID).subscribe(predictions => {
                this.loading = false;
                const categoryPredictions = predictions.filter(pred => pred.category.id === categoryId);
                if (categoryPredictions.length > 0) {
                    this.predictions = [...categoryPredictions];
                    this.alreadyVoted = true;
                    this.populatePredictions();
                }
            })
        })
    }

    populatePredictions() {
        if (!this.categoryEncounters.length || !this.predictions.length) return;

        // Crear mapa de enfrentamientos para acceso rápido
        const encountersMap = new Map<string, Encounter>();
        this.categoryEncounters.forEach(e => {
            encountersMap.set(`${e.level}-${e.order}`, e);
        });

        // Ordenar niveles de mayor a menor para propagar ganadores correctamente de rondas iniciales a finales
        const maxLevel = Math.max(...this.categoryEncounters.map(e => e.level));
        for (let level = maxLevel; level >= 0; level--) {
            const levelEncounters = this.categoryEncounters.filter(e => e.level === level);
            for (const encounter of levelEncounters) {
                // Buscamos una predicción para este nivel y orden. En caso de haber duplicados históricos en la BD,
                // priorizamos aquella cuyo ganador coincida con uno de los robots participantes de esta ronda.
                const pred = this.predictions.find(
                    p => p.level === level && p.order === encounter.order && (p.winner === encounter.robot1 || p.winner === encounter.robot2)
                );
                
                if (pred && pred.winner) {
                    let matchedWinner: 1 | 2 | undefined = undefined;
                    if (encounter.robot1 === pred.winner) {
                        encounter.winner = 1;
                        matchedWinner = 1;
                    } else if (encounter.robot2 === pred.winner) {
                        encounter.winner = 2;
                        matchedWinner = 2;
                    }

                    // Propagar al siguiente nivel solamente si el ganador es válido para este enfrentamiento
                    if (matchedWinner !== undefined) {
                        const nextLevel = level - 1;
                        if (nextLevel >= 0) {
                            const nextOrder = Math.floor(encounter.order / 2);
                            const nextEncounter = encountersMap.get(`${nextLevel}-${nextOrder}`);
                            if (nextEncounter) {
                                if (encounter.order % 2 === 0) {
                                    nextEncounter.robot1 = pred.winner;
                                } else {
                                    nextEncounter.robot2 = pred.winner;
                                }
                            }
                        }
                    }
                }
            }
        }
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

        const idx = this.predictions.findIndex(p => p.level === encounter.level && p.order === encounter.order && p.category.id === encounter.category.id);
        
        if (winnerId) {
            if (idx !== -1) {
                this.predictions[idx].winner = winnerId;
            } else {
                this.predictions.push({
                    id: `${encounter.category.id}_${encounter.level}_${encounter.order}`,
                    uID: this.currentUser.uID,
                    level: encounter.level,
                    order: encounter.order,
                    category: encounter.category,
                    winner: winnerId,
                    fullname: this.currentUser.fullname,
                });
            }
        } else {
            // Si el ganador es indefinido (desselección o propagación por cambios), eliminamos la predicción local
            if (idx !== -1) {
                this.predictions.splice(idx, 1);
            }
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
        if (this.predictions.length === 0 || !this.currentUser) return this.navigateToNext();
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
        this.router.navigate(['/asimov/dashboard']);
    }
}
