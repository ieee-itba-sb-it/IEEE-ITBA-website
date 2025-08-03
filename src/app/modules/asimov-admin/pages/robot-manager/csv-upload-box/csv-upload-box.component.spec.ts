import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvUploadBoxComponent } from './csv-upload-box.component';

describe('CsvUploadBoxComponent', () => {
  let component: CsvUploadBoxComponent;
  let fixture: ComponentFixture<CsvUploadBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsvUploadBoxComponent]
    });
    fixture = TestBed.createComponent(CsvUploadBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
