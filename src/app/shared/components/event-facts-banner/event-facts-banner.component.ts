import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-event-facts-banner',
    templateUrl: './event-facts-banner.component.html',
    styleUrls: ['./event-facts-banner.component.css']
})
export class EventFactsBannerComponent {
    @Input() imageUrl: String
    @Input() imageAlt: String
    @Input() facts: string[]

}
