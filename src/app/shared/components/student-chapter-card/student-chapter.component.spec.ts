import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChapterComponent } from './student-chapter.component';

describe('EventCardComponent', () => {
  let component: StudentChapterComponent;
  let fixture: ComponentFixture<StudentChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
