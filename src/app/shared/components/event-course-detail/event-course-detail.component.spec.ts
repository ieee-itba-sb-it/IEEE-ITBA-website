import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCourseDetailComponent } from './event-course-detail.component';

describe('EventCourseDetailComponent', () => {
  let component: EventCourseDetailComponent;
  let fixture: ComponentFixture<EventCourseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventCourseDetailComponent]
    });
    fixture = TestBed.createComponent(EventCourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
