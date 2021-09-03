import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedPythonComponent } from './advanced-python.component';

describe('AdvancedPythonComponent', () => {
  let component: AdvancedPythonComponent;
  let fixture: ComponentFixture<AdvancedPythonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedPythonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedPythonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
