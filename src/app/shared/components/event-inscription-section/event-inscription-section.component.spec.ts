import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInscriptionSectionComponent } from './event-inscription-section.component';

describe('EventInscriptionSectionComponent', () => {
  let component: EventInscriptionSectionComponent;
  let fixture: ComponentFixture<EventInscriptionSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventInscriptionSectionComponent]
    });
    fixture = TestBed.createComponent(EventInscriptionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
