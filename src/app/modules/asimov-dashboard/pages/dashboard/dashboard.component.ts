import {Component, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import {AsimovService} from "../../../../core/services/asimov/asimov.service";
import {Observable} from "rxjs";

export type Score = {
    uID: string
    fullname: string
    score: number
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    leaderboard$: Observable<Score[]>;
    leaderboard: Score[] = [];
    @ViewChildren('row') rows!: QueryList<ElementRef<HTMLTableRowElement>>;

    constructor(private asimovService: AsimovService){}

    ngOnInit(): void {
        this.leaderboard$ = this.asimovService.getScores();

        this.leaderboard$.subscribe((newScores) => {
            const prevRects = new Map<string, DOMRect>();

            // guardo posiciones anteriores
            this.rows?.forEach((row, index) => {
                const id = this.leaderboard[index]?.uID;
                if (id) {
                    prevRects.set(id, row.nativeElement.getBoundingClientRect());
                }
            });

            // actualizo los datos
            this.leaderboard = [...newScores].sort((a, b) => b.score - a.score);

            // esperamos al siguiente ciclo de detección de cambios
            requestAnimationFrame(() => {
                this.rows?.forEach((row, index) => {
                    const id = this.leaderboard[index]?.uID;
                    const prevRect = prevRects.get(id);
                    const newRect = row.nativeElement.getBoundingClientRect();

                    if (prevRect) {
                        const deltaY = prevRect.top - newRect.top;
                        if (deltaY !== 0) {
                            const el = row.nativeElement;
                            el.style.transition = 'none';
                            el.style.transform = `translateY(${deltaY}px)`;

                            requestAnimationFrame(() => {
                                el.style.transition = 'transform 300ms ease';
                                el.style.transform = '';
                            });
                        }
                    }
                });
            });
        });
    }

    trackByUid(index: number, player: Score): string {
        return player.uID;
    }
}
