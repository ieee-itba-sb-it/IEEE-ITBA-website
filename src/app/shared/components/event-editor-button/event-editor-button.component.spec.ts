import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEditorButtonComponent } from './event-editor-button.component';

describe('EventEditorButtonComponent', () => {
  let component: EventEditorButtonComponent;
  let fixture: ComponentFixture<EventEditorButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventEditorButtonComponent]
    });
    fixture = TestBed.createComponent(EventEditorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
