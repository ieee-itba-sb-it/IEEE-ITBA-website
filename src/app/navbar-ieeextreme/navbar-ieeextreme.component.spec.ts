import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarIeeextremeComponent } from './navbar-ieeextreme.component';

describe('NavbarIeeextremeComponent', () => {
  let component: NavbarIeeextremeComponent;
  let fixture: ComponentFixture<NavbarIeeextremeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarIeeextremeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarIeeextremeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
