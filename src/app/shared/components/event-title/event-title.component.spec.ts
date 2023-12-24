import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTitleComponent } from './event-title.component';

describe('EventTitleComponent', () => {
    let component: EventTitleComponent;
    let fixture: ComponentFixture<EventTitleComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            
        });
        fixture = TestBed.createComponent(EventTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
