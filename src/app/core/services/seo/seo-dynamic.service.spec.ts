import { TestBed } from '@angular/core/testing';

import { DynamicSeoService } from './seo-dynamic.service';

describe('SeoDynamicService', () => {
  let service: DynamicSeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicSeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
