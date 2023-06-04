import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbComponent } from './emb.component';

describe('EmbComponent', () => {
  let component: EmbComponent;
  let fixture: ComponentFixture<EmbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
