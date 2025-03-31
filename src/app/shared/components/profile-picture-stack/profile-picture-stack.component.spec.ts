import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePictureStackComponent } from './profile-picture-stack.component';

describe('ProfilePictureStackComponent', () => {
  let component: ProfilePictureStackComponent;
  let fixture: ComponentFixture<ProfilePictureStackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePictureStackComponent]
    });
    fixture = TestBed.createComponent(ProfilePictureStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
