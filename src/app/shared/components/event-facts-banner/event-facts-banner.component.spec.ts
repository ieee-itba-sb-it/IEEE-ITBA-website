import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFactsBannerComponent } from './event-facts-banner.component';

describe('EventFactsBannerComponent', () => {
    let component: EventFactsBannerComponent;
    let fixture: ComponentFixture<EventFactsBannerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EventFactsBannerComponent]
        });
        fixture = TestBed.createComponent(EventFactsBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy(); 
    });
});
