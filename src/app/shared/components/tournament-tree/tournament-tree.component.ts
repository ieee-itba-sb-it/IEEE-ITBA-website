import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {Encounter} from "../../models/event/asimov/encounter";
import {Robot} from "../../models/event/asimov/robot";

@Component({
    selector: 'app-tournament-tree',
    templateUrl: './tournament-tree.component.html',
    styleUrls: ['./tournament-tree.component.css']
})
export class TournamentTreeComponent implements OnInit, OnChanges {

    @Input() initialEncounters: Encounter[] = [];
    @Input() robots: Robot[] = [];
    @Output() vote = new EventEmitter<Encounter>(); // Renombrado de onVote a vote

    public bracketLevels = new Map<number, Encounter[]>();
    public finalLevel = 0;
    private robotsMap = new Map<string, Robot>();

    ngOnInit(): void {
        this.processBracketData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['initialEncounters'] || changes['robots']) {
            this.processBracketData();
        }
    }

    private processBracketData(): void {
        if (!this.initialEncounters || this.initialEncounters.length === 0) {
            this.bracketLevels.clear();
            return;
        }

        this.robotsMap.clear();
        this.robots.forEach(robot => this.robotsMap.set(robot.id, robot));

        const encountersByLevel = new Map<number, Encounter[]>();
        let maxLevel = 0;
        for (const encounter of this.initialEncounters) {
            if (!encountersByLevel.has(encounter.level)) {
                encountersByLevel.set(encounter.level, []);
            }
            encountersByLevel.get(encounter.level)!.push(encounter);
            if (encounter.level > maxLevel) {
                maxLevel = encounter.level;
            }
        }
        this.finalLevel = maxLevel;

        encountersByLevel.forEach((encounters) => {
            encounters.sort((a, b) => a.order - b.order);
        });

        this.bracketLevels = encountersByLevel;
    }

    public getRobot(robotId: string): Robot | undefined {
        return this.robotsMap.get(robotId);
    }

    /**
     * Maneja la votación en un enfrentamiento.
     * @param encounter El enfrentamiento en el que se vota.
     * @param winnerNumber El robot ganador (1 o 2).
     */
    public votation(encounter: Encounter, winnerNumber: 1 | 2): void {
        // 2. Verificar que ambos robots estén definidos
        if (!encounter.robot1 || !encounter.robot2) {
            return;
        }

        const winnerId = winnerNumber === 1 ? encounter.robot1 : encounter.robot2;
        if (!winnerId) return;

        // 3. Si se hace clic en el ganador actual, desseleccionar
        if (encounter.winner === winnerNumber) {
            encounter.winner = undefined;
            this.vote.emit(encounter);
            this.updateNextEncounters(encounter, undefined);
            return;
        }

        encounter.winner = winnerNumber;
        this.vote.emit(encounter);

        // 1. Actualizar recursivamente todos los encuentros siguientes
        this.updateNextEncounters(encounter, winnerId);
    }

    /**
     * Actualiza recursivamente todos los encuentros siguientes cuando cambia un ganador.
     * @param encounter El encuentro actual.
     * @param winnerId El ID del robot ganador.
     */
    private updateNextEncounters(encounter: Encounter, winnerId: string | undefined): void {
        const nextLevel = encounter.level - 1;
        if (nextLevel < 0) {
            return;
        }

        const nextEncounterOrder = Math.floor(encounter.order / 2);
        const nextEncounters = this.bracketLevels.get(nextLevel);
        const nextEncounter = nextEncounters?.find(e => e.order === nextEncounterOrder);

        if (nextEncounter) {
            const slot: 'robot1' | 'robot2' = encounter.order % 2 === 0 ? 'robot1' : 'robot2';
            
            if (winnerId !== undefined) {
                // Si hay un ganador, actualizar el robot en el encuentro siguiente
                nextEncounter[slot] = winnerId;
            } else {
                // Si no hay ganador (desselección), limpiar el robot del encuentro siguiente
                nextEncounter[slot] = '';
            }

            // Si se cambió el robot, limpiar el ganador del encuentro siguiente
            if (nextEncounter.winner) {
                nextEncounter.winner = undefined;
                this.vote.emit(nextEncounter);
                // Continuar recursivamente
                this.updateNextEncounters(nextEncounter, undefined);
            }
        }
    }

    protected readonly Math = Math;
}
