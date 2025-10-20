import { Component } from '@angular/core';

interface Team {
  name: string;
  itbaRank: number;
  countryRank: number;
  globalRank: number;
}

@Component({
  selector: 'app-ieeextreme-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {
  sampleTeams: Team[] = [
    { name: 'Team Alpha', itbaRank: 1, countryRank: 5, globalRank: 12 },
    { name: 'Team Beta', itbaRank: 2, countryRank: 8, globalRank: 18 },
    { name: 'Team Gamma', itbaRank: 3, countryRank: 12, globalRank: 25 },
    { name: 'Team Delta', itbaRank: 4, countryRank: 15, globalRank: 32 },
    { name: 'Team Epsilon', itbaRank: 5, countryRank: 18, globalRank: 38 },
    { name: 'Team Zeta', itbaRank: 6, countryRank: 22, globalRank: 45 },
    { name: 'Team Eta', itbaRank: 7, countryRank: 25, globalRank: 52 },
    { name: 'Team Theta', itbaRank: 8, countryRank: 28, globalRank: 58 }
  ];
}