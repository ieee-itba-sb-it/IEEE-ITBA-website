import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WritersFormComponent } from './writers-form.component';

describe('WritersFormComponent', () => {
  let component: WritersFormComponent;
  let fixture: ComponentFixture<WritersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WritersFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
