import { TestBed } from '@angular/core/testing';

import { Testimnial } from './testimnial';

describe('Testimnial', () => {
  let service: Testimnial;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Testimnial);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
