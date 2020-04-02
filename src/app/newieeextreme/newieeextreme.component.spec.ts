import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewieeextremeComponent } from './newieeextreme.component';

describe('NewieeextremeComponent', () => {
  let component: NewieeextremeComponent;
  let fixture: ComponentFixture<NewieeextremeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewieeextremeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewieeextremeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
