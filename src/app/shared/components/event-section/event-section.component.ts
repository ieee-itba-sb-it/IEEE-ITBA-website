import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-event-section',
    templateUrl: './event-section.component.html',
    styleUrls: ['./event-section.component.css']
})
export class EventSectionComponent {
  @Input() title: String;
  @Input() asimov: boolean = false;
}
