import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItbaIeeeMarcaComponent } from './itba-ieee-marca.component';

describe('ItbaIeeeMarcaComponent', () => {
  let component: ItbaIeeeMarcaComponent;
  let fixture: ComponentFixture<ItbaIeeeMarcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItbaIeeeMarcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItbaIeeeMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
