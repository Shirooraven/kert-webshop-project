import { TestBed } from '@angular/core/testing';

import { FlowerFirestoreService } from './flower-firestore.service';

describe('FlowerFirestoreService', () => {
  let service: FlowerFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowerFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
