import { TestBed } from '@angular/core/testing';

import { RessourceAllService } from './ressource-all.service';

describe('RessourceAllService', () => {
  let service: RessourceAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RessourceAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
