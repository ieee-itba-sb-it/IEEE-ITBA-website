import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeeeMeetupComponent } from './ieee-meetup.component';

describe('IeeeMeetupComponent', () => {
  let component: IeeeMeetupComponent;
  let fixture: ComponentFixture<IeeeMeetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IeeeMeetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeeeMeetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
