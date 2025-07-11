import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {AsimovService} from '../../../../core/services/asimov/asimov.service';
import {Category} from "../../../../shared/models/event/asimov/category";
import {Robot} from "../../../../shared/models/event/asimov/robot";
import {Encounter} from "../../../../shared/models/event/asimov/encounter";

@Component({
    selector: 'app-encounters',
    templateUrl: './encounters.component.html',
    styleUrls: ['./encounters.component.css']
})
export class EncountersComponent implements OnInit {
    categories$: Observable<Category[]>;
    robots$: Observable<Robot[]>;
    selectedTabIndex = 0;
    selectedRobot1: Robot | null = null;
    selectedRobot2: Robot | null = null;
    robot1SearchText = '';
    robot2SearchText = '';
    encountersList: Encounter[] = [];
    displayedColumns: string[] = ['number', 'robot1', 'vs', 'robot2', 'winner', 'actions'];

    private robots: Robot[] = []; // Lista completa de robots
    private currentCategoryId: string = '';

    constructor(
    private asimovService: AsimovService
    ) {
        this.robots$ = this.asimovService.getRobots();
        this.categories$ = this.asimovService.getCategories();
        this.robots$.subscribe(robots => this.robots = robots);
    }

    ngOnInit(): void {}

    onTabChange(event: any): void {
        this.selectedTabIndex = event.index;
        // Actualizar la categoría actual y cargar robots correspondientes
        this.loadRobotsForCurrentCategory();
        this.resetForm();
        this.loadEncountersForCategory();
    }

    getFilteredRobots(searchText: string): Robot[] {
        if (!searchText) {
            return this.getRobotsForCurrentCategory();
        }

        return this.getRobotsForCurrentCategory().filter(robot =>
            robot.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    addInitialEncounter(robot1: Robot | null, robot2: Robot | null): void {
        if (!robot1 || !robot2 || robot1.id === robot2.id) {
            return;
        }

        this.categories$.subscribe(categories => {
            const category = categories.find(c => c.id === this.currentCategoryId);
            if (category) {
                this.encountersList.push({
                    id: uuid(),
                    level: 0,
                    order: this.encountersList.filter(e => e.level === 0).length, // Asignar orden secuencial
                    category: category, // Usar categoría válida
                    robot1: this.selectedRobot1?.id || '', // Usar el id del robot como string
                    robot2: this.selectedRobot2?.id || '', // Usar el id del robot como string
                    winner: null // Inicializar como null
                });
            }
            this.resetForm();

        });
    }

    selectWinner(encounter: Encounter, winner: Robot | null): void {
        if (!winner) return;
        encounter.winner = winner.id == encounter.robot1 ? 1 : 2;
        this.checkAndGenerateNextEncounter(encounter);
    }

    deleteEncounter(encounter: Encounter): void {
        // Solo permitir eliminar enfrentamientos del nivel inicial (nivel 0)
        if (encounter.level === 0) {
            const index = this.encountersList.findIndex(e => e.id === encounter.id);
            if (index > -1) {
                this.encountersList.splice(index, 1);
                this.deleteDescendantBranch(encounter);
            }
        }
    }

    resetWinner(encounter: Encounter): void {
        encounter.winner = null;
        this.deleteDescendantBranch(encounter);
    }

    saveCurrentState(): void {
        // Reorganizar los niveles antes de guardar (invertir la numeración)
        const reorganizedEncounters = this.reorganizeLevelsForSaving(this.encountersList);

        // Guardar los enfrentamientos reorganizados
        this.asimovService.setEncounters(reorganizedEncounters, this.robots).subscribe({
            next: () => {
                console.log('Enfrentamientos guardados correctamente');
            },
            error: (error) => {
                console.error('Error al guardar los enfrentamientos:', error);
            }
        });
    }

    private reorganizeLevelsForSaving(encounters: Encounter[]): Encounter[] {
        if (encounters.length === 0) return [];

        // Encontrar el nivel máximo actual
        const maxLevel = Math.max(...encounters.map(e => e.level));

        // Crear una copia de los enfrentamientos con niveles invertidos
        return encounters.map(encounter => ({
            ...encounter,
            level: maxLevel - encounter.level // Invertir los niveles
        }));
    }

    getLevels(): number[] {
        const levels = [...new Set(this.encountersList.map(e => e.level))];
        return levels.sort((a, b) => a - b);
    }

    getEncountersByLevel(level: number): Encounter[] {
        return this.encountersList
            .filter(e => e.level === level)
            .sort((a, b) => a.order - b.order);
    }

    getRobotById(robotId: string): Robot | null {
        const robot = this.robots.find(robot => robot.id === robotId);
        return robot ? robot : null; // Devuelve null si no se encuentra el robot
    }

    private loadRobotsForCurrentCategory(): void {
        this.categories$.subscribe(categories => {
            const category = categories[this.selectedTabIndex];
            if (category) {
                this.currentCategoryId = category.id;
                this.loadEncountersForCategory();
            }
        });
    }

    private getRobotsForCurrentCategory(): Robot[] {
    // Retornar robots filtrados por categoría actual
        return this.robots.filter(robot => robot.category.id === this.currentCategoryId); // Comparar id de categoría
    }

    private loadEncountersForCategory(): void {
        this.asimovService.getEncounters().subscribe(encounters => {
            this.encountersList = encounters.filter(encounter => encounter.category.id === this.currentCategoryId);
        });
    }

    private resetForm(): void {
        this.selectedRobot1 = null;
        this.selectedRobot2 = null;
        this.robot1SearchText = '';
        this.robot2SearchText = '';
    }

    private checkAndGenerateNextEncounter(encounter: Encounter): void {
        // Encontrar el enfrentamiento "contrario" (pareja) en el mismo nivel
        const pairEncounter = this.findPairEncounter(encounter);

        // Solo proceder si ambos enfrentamientos tienen ganador
        if (pairEncounter && pairEncounter.winner && encounter.winner) {
            // Crear el enfrentamiento del siguiente nivel
            this.createNextLevelEncounter(encounter, pairEncounter);
        }
    }

    private findPairEncounter(encounter: Encounter): Encounter | null {
        const sameLevel = this.getEncountersByLevel(encounter.level);

        // Determinar si el order es par o impar para encontrar su pareja
        const isEvenOrder = encounter.order % 2 === 0;
        const pairOrder = isEvenOrder ? encounter.order + 1 : encounter.order - 1;

        return sameLevel.find(e => e.order === pairOrder) || null;
    }

    private createNextLevelEncounter(encounter1: Encounter, encounter2: Encounter): void {
        const nextLevel = encounter1.level + 1;

        // Verificar si ya existe este enfrentamiento en el siguiente nivel
        const nextLevelEncounters = this.getEncountersByLevel(nextLevel);
        const expectedOrder = Math.floor(encounter1.order / 2);

        const existingEncounter = nextLevelEncounters.find(e => e.order === expectedOrder);
        if (existingEncounter) {
            return;
        }

        // Determinar el orden correcto basado en los orders de los enfrentamientos padre
        const orderedEncounters = [encounter1, encounter2].sort((a, b) => a.order - b.order);

        // Obtener los IDs de los ganadores
        const winner1Id = orderedEncounters[0].winner === 1 ? orderedEncounters[0].robot1 : orderedEncounters[0].robot2;
        const winner2Id = orderedEncounters[1].winner === 1 ? orderedEncounters[1].robot1 : orderedEncounters[1].robot2;

        this.categories$.subscribe(categories => {
            const category = categories.find(c => c.id === this.currentCategoryId);
            if (category) {
                const newEncounter: Encounter = {
                    id: uuid(),
                    robot1: winner1Id,
                    robot2: winner2Id,
                    level: nextLevel,
                    order: expectedOrder,
                    category: category,
                    winner: null
                };

                this.encountersList.push(newEncounter);
            }
        });
    }

    private deleteDescendantBranch(encounter: Encounter): void {
        const nextLevel = encounter.level + 1;
        const expectedNextOrder = Math.floor(encounter.order / 2);

        // Buscar el enfrentamiento descendiente directo
        const descendant = this.encountersList.find(e =>
            e.level === nextLevel && e.order === expectedNextOrder
        );

        if (descendant) {
            // Recursivamente eliminar la rama descendiente
            this.deleteDescendantBranch(descendant);

            // Eliminar el descendiente
            const descendantIndex = this.encountersList.findIndex(e => e.id === descendant.id);
            if (descendantIndex > -1) {
                this.encountersList.splice(descendantIndex, 1);
            }
        }
    }
}
