import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentTreeComponent } from './tournament-tree.component';

describe('TournamentTreeComponent', () => {
  let component: TournamentTreeComponent;
  let fixture: ComponentFixture<TournamentTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentTreeComponent]
    });
    fixture = TestBed.createComponent(TournamentTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
