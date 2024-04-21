import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEditorModalComponent } from './event-editor-modal.component';

describe('EventEditorModalComponent', () => {
  let component: EventEditorModalComponent;
  let fixture: ComponentFixture<EventEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventEditorModalComponent]
    });
    fixture = TestBed.createComponent(EventEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
