import { Pipe, type PipeTransform } from '@angular/core';
import { Encounter } from '../../../../../shared/models/event/asimov/encounter';
import { Category } from '../../../../../shared/models/event/asimov/category';

interface FilterableByCategory {
  category: Category;
}

@Pipe({
    name: 'appfilterByCategory',
    standalone: true,
})
export class FilterByCategory implements PipeTransform {

    transform<T extends FilterableByCategory>(value: T[], ...args: [Category]): T[] {
        const category = args[0];
        return (value ?? []).filter((e) => e.category.id === category.id);
    }
}
