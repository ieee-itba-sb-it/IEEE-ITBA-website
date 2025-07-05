import { Component } from '@angular/core';
import { Encounter } from '../../../../shared/models/event/asimov/encounter';
import { Observable } from 'rxjs';
import { Robot } from '../../../../shared/models/event/asimov/robot';
import { v4 as uuid } from 'uuid';
import {AsimovService} from "../../../../core/services/asimov/asimov.service";
import { Category } from '../../../../shared/models/event/asimov/category';

@Component({
    selector: 'app-encounters',
    templateUrl: './encounters.component.html',
    styleUrls: ['./encounters.component.css']
})
export class EncountersComponent {
    robots$: Observable<Robot[]>;
    categories$: Observable<Category[]>;

    loading = false;
    error: string | null = null;

    selectedCategory: Category | null = null;
    encountersByCategory: { [catId: string]: Encounter[] } = {};
    selectedRobot1: Robot | null = null;
    selectedRobot2: Robot | null = null;
    robotsList: Robot[] = [];

    constructor(private encounterService: AsimovService) {
        this.robots$ = this.encounterService.getRobots();
        this.categories$ = this.encounterService.getCategories();
        this.robots$.subscribe(robots => this.robotsList = robots);
    }

    // Cambiar el getter y setter de encounters para evitar conflicto de nombre con la propiedad encountersByCategory
    get encountersList(): Encounter[] {
        return this.selectedCategory ? (this.encountersByCategory[this.selectedCategory.id] || []) : [];
    }

    set encountersList(val: Encounter[]) {
        if (this.selectedCategory) {
            this.encountersByCategory[this.selectedCategory.id] = val;
        }
    }

    onCategoryChange(category: Category) {
        this.selectedCategory = category;
        if (!this.encountersByCategory[category.id]) {
            this.encountersByCategory[category.id] = [];
        }
        this.selectedRobot1 = null;
        this.selectedRobot2 = null;
    }

    // Agrega un enfrentamiento inicial
    addInitialEncounter(robot1: Robot, robot2: Robot) {
        if (!this.selectedCategory) return;
        const newEncounter: Encounter = {
            id: uuid(),
            robot1: robot1.id,
            robot2: robot2.id,
            winner: null,
            level: 1,
            order: this.encountersList.filter(e => e.level === 1).length + 1,
            category: this.selectedCategory
        };
        this.encountersList = [...this.encountersList, newEncounter];
    }

    // Genera los siguientes encuentros vacíos según los iniciales
    generateNextRounds() {
        if (!this.selectedCategory) return;
        const currentEncounters = this.encountersList;
        const initialCount = currentEncounters.filter(e => e.level === 1).length;
        let level = 2;
        let prevLevelCount = initialCount;
        let order = 1;
        let newEncounters = [...currentEncounters];
        while (prevLevelCount > 1) {
            const nextLevelCount = Math.floor(prevLevelCount / 2);
            for (let i = 0; i < nextLevelCount; i++) {
                newEncounters.push({
                    id: uuid(),
                    robot1: null,
                    robot2: null,
                    winner: null,
                    level: level,
                    order: order++,
                    category: this.selectedCategory
                });
            }
            prevLevelCount = nextLevelCount;
            level++;
            order = 1;
        }
        this.encountersList = newEncounters;
    }

    // Selecciona el ganador de un encuentro
    setWinner(encounter: Encounter, robotId: string) {
        encounter.winner = encounter.robot1 === robotId ? 1 : 2;
        this.updateNextRound(encounter);
    }

    // Actualiza el robot en el siguiente encuentro según el ganador
    updateNextRound(encounter: Encounter) {
        const nextLevel = encounter.level + 1;
        const nextEncounter = this.encountersList.find(e => e.level === nextLevel && Math.ceil(encounter.order / 2) === e.order);
        if (nextEncounter) {
            if (encounter.order % 2 === 1) {
                nextEncounter.robot1 = encounter.winner === 1 ? encounter.robot1 : encounter.robot2;
            } else {
                nextEncounter.robot2 = encounter.winner === 1 ? encounter.robot1 : encounter.robot2;
            }
        }
    }

    // Guarda los encuentros en Firestore
    saveEncounters(robots: Robot[]) {
        this.loading = true;
        this.error = null;
        // Generar automáticamente las siguientes rondas antes de guardar
        this.generateNextRounds();
        // Guardar solo los encuentros de la categoría seleccionada
        this.encounterService.setEncounters(this.encountersList, robots).subscribe({
            next: () => this.loading = false,
            error: err => {
                this.loading = false;
                this.error = err.message || 'Error al guardar los encuentros';
            }
        });
    }

    // Utilitarios para el template
    getLevels(): number[] {
        const levels = new Set(this.encountersList.map(e => e.level));
        return Array.from(levels).sort((a, b) => a - b);
    }

    getRobotName(robotId: string | null): string {
        if (!robotId) return '-';
        const robot = this.robotsList.find(r => r.id === robotId);
        return robot ? robot.name : robotId;
    }

    getEncountersByLevel(level: number): Encounter[] {
        return this.encountersList.filter(e => e.level === level);
    }
}
