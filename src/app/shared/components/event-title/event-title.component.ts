import { Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-event-title',
    templateUrl: './event-title.component.html',
    styleUrls: ['./event-title.component.css']
})
export class EventTitleComponent {
    @Input() asimov: boolean = false;
}
