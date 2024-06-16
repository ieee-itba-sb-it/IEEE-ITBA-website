import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDateChipsComponent } from './event-date-chips.component';

describe('EventDateChipComponent', () => {
  let component: EventDateChipsComponent;
  let fixture: ComponentFixture<EventDateChipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventDateChipsComponent]
    });
    fixture = TestBed.createComponent(EventDateChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
