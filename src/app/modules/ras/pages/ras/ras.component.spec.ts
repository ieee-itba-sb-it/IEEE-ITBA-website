import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RasComponent } from './ras.component';

describe('RasComponent', () => {
  let component: RasComponent;
  let fixture: ComponentFixture<RasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
