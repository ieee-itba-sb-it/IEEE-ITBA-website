import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventContentCardComponent } from './event-content-card.component';

describe('EventContentCardComponent', () => {
    let component: EventContentCardComponent;
    let fixture: ComponentFixture<EventContentCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EventContentCardComponent]
        });
        fixture = TestBed.createComponent(EventContentCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
