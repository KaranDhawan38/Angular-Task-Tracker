import { TestBed } from '@angular/core/testing';

import { TokenIterceptorService } from './token-iterceptor.service';

describe('TokenIterceptorService', () => {
  let service: TokenIterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenIterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
