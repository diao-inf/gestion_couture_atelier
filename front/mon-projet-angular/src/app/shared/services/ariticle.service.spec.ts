import { TestBed } from '@angular/core/testing';

import { AriticleService } from './ariticle.service';

describe('AriticleService', () => {
  let service: AriticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AriticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
