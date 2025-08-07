import { Pipe, type PipeTransform } from '@angular/core';
import { Encounter } from '../../../../../shared/models/event/asimov/encounter';
import { v4 as uuid } from 'uuid';

@Pipe({
    name: 'appCompleteEncounterLevels',
    standalone: true,
})
export class CompleteEncounterLevelsPipe implements PipeTransform {

    transform(value: Encounter[], ...args: unknown[]): Encounter[] {
        const encounterByLevel = new Map<number, Encounter[]>();
        let maxLevel = -1;
        value.forEach((encounter) => {
            if (encounter.level > maxLevel) {
                maxLevel = encounter.level;
            }
            let encounterList = [] as Encounter[];
            if (!encounterByLevel.has(encounter.level)) {
                encounterByLevel.set(encounter.level, encounterList);
            } else {
                encounterList = encounterByLevel.get(encounter.level) ?? [];
            }
            encounterList.push(encounter);
        });
        if (maxLevel === -1) return [];
        for (let i = maxLevel; i >= 0; i -= 1) {
            const encountersCount = 2 ** i;
            const encounterList = encounterByLevel.get(i) ?? [];
            if (encounterList.length < encountersCount) {
                const missingEncounters = encountersCount - encounterList.length;
                for (let j = 0; j < missingEncounters; j += 1) {
                    encounterList.push({
                        id: uuid(),
                        level: i,
                        order: j + encounterList.length,
                        category: value[0].category,
                        robot1: '',
                        robot2: ''
                    });
                }
            }
            encounterByLevel.set(i, encounterList);
        }
        const result =  [...encounterByLevel.values()].sort((a, b) => (b[0].level - a[0].level)).flat();
        return result;
    }

}
