import { Component, Input} from '@angular/core';

@Component({
    selector: 'app-event-faq-accordion',
    templateUrl: './event-faq-accordion.component.html',
    styleUrls: ['./event-faq-accordion.component.css']
})
export class EventFaqAccordionComponent {
    @Input() faq: [q: String, a: String];
    @Input() asimov: boolean = false;
}
