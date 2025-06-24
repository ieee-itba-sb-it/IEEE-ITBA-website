import { TestBed } from '@angular/core/testing';

import { AsimovService } from './asimov.service';

describe('AsimovService', () => {
  let service: AsimovService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsimovService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
