import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeeeEventosComponent } from './ieee-eventos.component';

describe('IeeeEventosComponent', () => {
  let component: IeeeEventosComponent;
  let fixture: ComponentFixture<IeeeEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IeeeEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeeeEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
