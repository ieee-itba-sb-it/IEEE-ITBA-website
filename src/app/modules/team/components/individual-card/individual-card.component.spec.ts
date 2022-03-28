import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCardComponent } from './individual-card.component';

describe('IndividualCardComponent', () => {
  let component: IndividualCardComponent;
  let fixture: ComponentFixture<IndividualCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
