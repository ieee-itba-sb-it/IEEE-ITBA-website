import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() previous: EventEmitter<any> = new EventEmitter();

  @Input() hasNext?: Boolean;
  @Input() hasPrevious?: Boolean;

  @Input() currentPage?: number;
  @Input() pageCount?: number;

  nextPage() {
      this.next.emit();
  }

  prevPage() {
      this.previous.emit();
  }

  constructor() {}

}
