import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFaqAccordionComponent } from './event-faq-accordion.component';

describe('EventFaqAccordionComponent', () => {
    let component: EventFaqAccordionComponent;
    let fixture: ComponentFixture<EventFaqAccordionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EventFaqAccordionComponent]
        });
        fixture = TestBed.createComponent(EventFaqAccordionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
