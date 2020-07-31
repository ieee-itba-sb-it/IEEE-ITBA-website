import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesColumnComponent } from './articles-column.component';

describe('ArticlesColumnComponent', () => {
  let component: ArticlesColumnComponent;
  let fixture: ComponentFixture<ArticlesColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
