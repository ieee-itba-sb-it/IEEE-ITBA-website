import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDComponent } from './forum-d.component';

describe('ForumDComponent', () => {
  let component: ForumDComponent;
  let fixture: ComponentFixture<ForumDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
