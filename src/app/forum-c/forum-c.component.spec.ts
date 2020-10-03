import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumCComponent } from './forum-c.component';

describe('ForumCComponent', () => {
  let component: ForumCComponent;
  let fixture: ComponentFixture<ForumCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
