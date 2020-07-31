import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsMainpageComponent } from './news-mainpage.component';

describe('NewsMainpageComponent', () => {
  let component: NewsMainpageComponent;
  let fixture: ComponentFixture<NewsMainpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsMainpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
