import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardShortComponent } from './event-card-shortcomponent';

describe('EventCardComponent', () => {
  let component: EventCardShortComponent;
  let fixture: ComponentFixture<EventCardShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCardShortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCardShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
