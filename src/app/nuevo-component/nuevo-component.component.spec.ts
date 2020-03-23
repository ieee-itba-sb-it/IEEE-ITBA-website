import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoComponentComponent } from './nuevo-component.component';

describe('NuevoComponentComponent', () => {
  let component: NuevoComponentComponent;
  let fixture: ComponentFixture<NuevoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
