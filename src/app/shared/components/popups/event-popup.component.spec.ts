import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPopupComponent } from './event-popup.component';

describe('EventPopupComponent', () => {
  let component: EventPopupComponent;
  let fixture: ComponentFixture<EventPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventPopupComponent]
    });
    fixture = TestBed.createComponent(EventPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
