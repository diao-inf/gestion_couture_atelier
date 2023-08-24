import { TestBed } from '@angular/core/testing';

import { FournisseurServiceService } from './fournisseur-service.service';

describe('FournisseurServiceService', () => {
  let service: FournisseurServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FournisseurServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
