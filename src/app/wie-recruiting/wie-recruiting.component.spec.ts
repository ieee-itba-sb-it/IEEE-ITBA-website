import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WIERECRUITINGComponent } from './wie-recruiting.component';

describe('WIERECRUITINGComponent', () => {
  let component: WIERECRUITINGComponent;
  let fixture: ComponentFixture<WIERECRUITINGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WIERECRUITINGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WIERECRUITINGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
