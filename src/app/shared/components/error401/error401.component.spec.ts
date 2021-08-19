import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Error401Component } from './error401.component';

describe('Error401Component', () => {
  let component: Error401Component;
  let fixture: ComponentFixture<Error401Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Error401Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error401Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
