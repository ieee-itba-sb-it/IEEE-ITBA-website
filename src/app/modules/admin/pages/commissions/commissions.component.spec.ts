import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionsComponent } from './commissions.component';

describe('CommissionsComponent', () => {
  let component: CommissionsComponent;
  let fixture: ComponentFixture<CommissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionsComponent]
    });
    fixture = TestBed.createComponent(CommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
