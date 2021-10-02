import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcupComponent } from './bitcup.component';

describe('BitcupComponent', () => {
  let component: BitcupComponent;
  let fixture: ComponentFixture<BitcupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitcupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitcupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
