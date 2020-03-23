import { TestBed } from '@angular/core/testing';

import { Compenent1Service } from './compenent1.service';

describe('Compenent1Service', () => {
  let service: Compenent1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Compenent1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
