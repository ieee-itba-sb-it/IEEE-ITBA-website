import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumBComponent } from './forum-b.component';

describe('ForumBComponent', () => {
  let component: ForumBComponent;
  let fixture: ComponentFixture<ForumBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
