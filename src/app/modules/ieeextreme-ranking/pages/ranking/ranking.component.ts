import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { IeeextremeService } from '../../../../core/services/ieeextreme/ieeextreme.service';
import { IeeextremeTeam } from '../../../../shared/models/event/ieeextreme/ieeextreme-team';

@Component({
  selector: 'app-ieeextreme-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit, OnDestroy {
  teams: IeeextremeTeam[] = [];
  private sub?: Subscription;
  loadError: string | null = null;
  @ViewChildren('row') rows!: QueryList<ElementRef<HTMLTableRowElement>>;

  constructor(private ieeextremeService: IeeextremeService) {}

  ngOnInit(): void {
    this.sub = this.ieeextremeService.getAllTeams().subscribe({
      next: (data) => {
        // capture previous DOM positions
        const prevRects = new Map<string, DOMRect>();
        this.rows?.forEach((row, index) => {
          const id = this.teams[index]?.name;
          if (id) prevRects.set(id, row.nativeElement.getBoundingClientRect());
        });

        // update and sort teams
        this.teams = [...data].sort((a, b) => (a.universityRank ?? 0) - (b.universityRank ?? 0));

        // animate position changes on next frame
        requestAnimationFrame(() => {
          this.rows?.forEach((row, index) => {
            const id = this.teams[index]?.name;
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
      },
      error: (err) => {
        console.error('Error loading IEEEXtreme teams', err);
      }
    });
  }

  trackByTeam(index: number, team: IeeextremeTeam): string {
    return team.name;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}