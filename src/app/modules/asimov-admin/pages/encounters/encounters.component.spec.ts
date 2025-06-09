import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncountersComponent } from './encounters.component';

describe('EncountersComponent', () => {
  let component: EncountersComponent;
  let fixture: ComponentFixture<EncountersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncountersComponent]
    });
    fixture = TestBed.createComponent(EncountersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
