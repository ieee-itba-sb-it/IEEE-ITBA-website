import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciativasComponent } from './iniciativas.component';

describe('IniciativasComponent', () => {
  let component: IniciativasComponent;
  let fixture: ComponentFixture<IniciativasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IniciativasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
