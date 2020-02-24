import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutIEEEItbaComponent } from './about-ieeeitba.component';

describe('AboutIEEEItbaComponent', () => {
  let component: AboutIEEEItbaComponent;
  let fixture: ComponentFixture<AboutIEEEItbaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutIEEEItbaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutIEEEItbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
