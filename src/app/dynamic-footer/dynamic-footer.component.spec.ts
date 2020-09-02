import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFooterComponent } from './dynamic-footer.component';

describe('DynamicFooterComponent', () => {
  let component: DynamicFooterComponent;
  let fixture: ComponentFixture<DynamicFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
