import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionEditorModalComponent } from './position-editor-modal.component';

describe('PositionEditorModalComponent', () => {
  let component: PositionEditorModalComponent;
  let fixture: ComponentFixture<PositionEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PositionEditorModalComponent]
    });
    fixture = TestBed.createComponent(PositionEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
