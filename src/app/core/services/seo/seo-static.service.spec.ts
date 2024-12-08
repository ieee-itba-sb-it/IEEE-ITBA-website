import { TestBed } from '@angular/core/testing';

import { StaticSeoService } from './seo-static.service';

describe('SeoService', () => {
  let service: StaticSeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticSeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
