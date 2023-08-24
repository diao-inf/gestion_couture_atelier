import { TestBed } from '@angular/core/testing';

import { CategorieServicesService } from './categorie-services.service';

describe('CategorieServicesService', () => {
  let service: CategorieServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
