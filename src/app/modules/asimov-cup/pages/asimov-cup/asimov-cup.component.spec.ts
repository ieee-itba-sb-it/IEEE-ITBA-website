import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsimovCupComponent } from './asimov-cup.component';

describe('AsimovCupComponent', () => {
  let component: AsimovCupComponent;
  let fixture: ComponentFixture<AsimovCupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsimovCupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsimovCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
