import { TestBed, inject } from '@angular/core/testing';

import { AuthenticatieService } from './authenticatie.service';

describe('AuthenticatieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticatieService]
    });
  });

  it('should ...', inject([AuthenticatieService], (service: AuthenticatieService) => {
    expect(service).toBeTruthy();
  }));
});
