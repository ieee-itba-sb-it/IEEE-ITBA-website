import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditorModalComponent } from './user-editor-modal.component';

describe('UserEditorModalComponent', () => {
  let component: UserEditorModalComponent;
  let fixture: ComponentFixture<UserEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserEditorModalComponent]
    });
    fixture = TestBed.createComponent(UserEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
