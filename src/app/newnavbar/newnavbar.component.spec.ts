import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewnavbarComponent } from './newnavbar.component';

describe('NewnavbarComponent', () => {
  let component: NewnavbarComponent;
  let fixture: ComponentFixture<NewnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
