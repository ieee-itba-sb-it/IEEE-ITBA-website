import { Component, Input} from '@angular/core';

@Component({
    selector: 'app-event-content-card',
    templateUrl: './event-content-card.component.html',
    styleUrls: ['./event-content-card.component.css']
})
export class EventContentCardComponent {
    @Input() title: string;
    @Input() imageUrl: string;
    @Input() image: Boolean= true;
    @Input() disabled: Boolean = false;
}
