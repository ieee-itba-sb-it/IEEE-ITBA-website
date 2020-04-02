import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewnavbarIeextremeComponent } from './newnavbar-ieextreme.component';

describe('NewnavbarIeextremeComponent', () => {
  let component: NewnavbarIeextremeComponent;
  let fixture: ComponentFixture<NewnavbarIeextremeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewnavbarIeextremeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewnavbarIeextremeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
