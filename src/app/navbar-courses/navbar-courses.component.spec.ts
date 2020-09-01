import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCoursesComponent } from './navbar-courses.component';

describe('NavbarCoursesComponent', () => {
  let component: NavbarCoursesComponent;
  let fixture: ComponentFixture<NavbarCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
