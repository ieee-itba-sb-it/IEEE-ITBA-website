import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDateSectionComponent } from './event-date-section.component';

describe('EventDateSectionComponent', () => {
  let component: EventDateSectionComponent;
  let fixture: ComponentFixture<EventDateSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventDateSectionComponent]
    });
    fixture = TestBed.createComponent(EventDateSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
