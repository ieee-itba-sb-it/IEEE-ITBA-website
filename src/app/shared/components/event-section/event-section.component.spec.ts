import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSectionComponent } from './event-section.component';

describe('EventSectionComponent', () => {
    let component: EventSectionComponent;
    let fixture: ComponentFixture<EventSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EventSectionComponent]
        });
        fixture = TestBed.createComponent(EventSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
    
    });
});
