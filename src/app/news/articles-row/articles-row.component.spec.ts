import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesRowComponent } from './articles-row.component';

describe('ArticlesRowComponent', () => {
  let component: ArticlesRowComponent;
  let fixture: ComponentFixture<ArticlesRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
