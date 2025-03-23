import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRequestComponent } from './team-request.component';

describe('TeamRequestComponent', () => {
  let component: TeamRequestComponent;
  let fixture: ComponentFixture<TeamRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamRequestComponent]
    });
    fixture = TestBed.createComponent(TeamRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
