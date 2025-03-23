import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPictureInputComponent } from './upload-picture-input.component';

describe('UploadPictureInputComponent', () => {
  let component: UploadPictureInputComponent;
  let fixture: ComponentFixture<UploadPictureInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadPictureInputComponent]
    });
    fixture = TestBed.createComponent(UploadPictureInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
