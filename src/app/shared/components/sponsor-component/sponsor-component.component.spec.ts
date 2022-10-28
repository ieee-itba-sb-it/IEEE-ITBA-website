import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorComponentComponent } from './sponsor-component.component';

describe('SponsorComponentComponent', () => {
  let component: SponsorComponentComponent;
  let fixture: ComponentFixture<SponsorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

