import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthActionModalComponent } from './auth-action-modal.component';

describe('AuthActionModalComponent', () => {
  let component: AuthActionModalComponent;
  let fixture: ComponentFixture<AuthActionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthActionModalComponent]
    });
    fixture = TestBed.createComponent(AuthActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
