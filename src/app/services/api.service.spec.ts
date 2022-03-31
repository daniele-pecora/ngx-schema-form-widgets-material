import {TestBed, inject} from '@angular/core/testing';

import {ApiService} from './api.service';
import {HttpClientModule} from "@angular/common/http";

describe('Api', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // add here all missing modules that are reported as unknown or missing in Karma
        HttpClientModule
      ],
      providers: [ApiService]
    });
  });

  it('should create', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));
});
