import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAnunciosComponent } from './navbar-anuncios.component';

describe('NavbarAnunciosComponent', () => {
  let component: NavbarAnunciosComponent;
  let fixture: ComponentFixture<NavbarAnunciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarAnunciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarAnunciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
