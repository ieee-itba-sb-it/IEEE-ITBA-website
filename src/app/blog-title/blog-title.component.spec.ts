import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTitleComponent } from './blog-title.component';

describe('BlogTitleComponent', () => {
  let component: BlogTitleComponent;
  let fixture: ComponentFixture<BlogTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
