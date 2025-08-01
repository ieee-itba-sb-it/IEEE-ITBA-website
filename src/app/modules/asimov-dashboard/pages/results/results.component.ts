import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AsimovService } from '../../../../core/services/asimov/asimov.service';
import { BehaviorSubject, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Category } from '../../../../shared/models/event/asimov/category';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TournamentTreeComponent } from '../../../../shared/components/tournament-tree/tournament-tree.component';
import { Robot } from '../../../../shared/models/event/asimov/robot';
import { Encounter } from '../../../../shared/models/event/asimov/encounter';
import { FilterByCategory } from './components/filter-by-category.pipe';
import { MatDialog } from '@angular/material/dialog';
import { EncountersWinnerModalComponent, ModalData } from './components/encounters-winner-modal/encounters-winner-modal.component';

@Component({
    selector: 'app-results',
    templateUrl: `./results.component.html`,
    styleUrls: ['./results.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent implements OnDestroy { 
    categories$: Observable<Category[]>;
    robots$: Observable<Robot[]>;
    allLiveEncounters$: Observable<Encounter[]>;
    destroy$ = new Subject();

    constructor(asimovService: AsimovService, matDialog: MatDialog) {
        this.categories$ = asimovService.getCategories();
        this.robots$ = asimovService.getRobots();
        this.allLiveEncounters$ = asimovService.getLiveEncounters().pipe(map(({ all }) => all));
        this.robots$.pipe(switchMap((robots) => {
            return asimovService.getLiveEncounters().pipe(map(({ winnerChanges }) => {
                return winnerChanges;
            })).pipe(map((winners) => ({ winners, robots })));
        })).pipe(takeUntil(this.destroy$)).subscribe({
            next: ({winners, robots}) => {
                if (winners.length > 0) {
                    const ref = matDialog.open(EncountersWinnerModalComponent, {
                        data: {
                            winners: winners,
                            robots
                        } as ModalData,
                    });

                    setTimeout(() => {
                        ref.close();
                    }, 3000);
                }
            }
        })

    }

    ngOnDestroy(): void {
        this.destroy$.next(void 0);
        this.destroy$.complete();
    }

  
}
