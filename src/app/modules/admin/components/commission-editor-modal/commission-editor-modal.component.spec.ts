import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionEditorModalComponent } from './commission-editor-modal.component';

describe('CommissionEditorModalComponent', () => {
  let component: CommissionEditorModalComponent;
  let fixture: ComponentFixture<CommissionEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionEditorModalComponent]
    });
    fixture = TestBed.createComponent(CommissionEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
