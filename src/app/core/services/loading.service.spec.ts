import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading false', () => {
    expect(service.loading()).toBe(false);
  });

  it('should set loading to true on show()', () => {
    service.show();
    expect(service.loading()).toBe(true);
  });

  it('should set loading to false on hide()', () => {
    service.show();
    service.hide();
    expect(service.loading()).toBe(false);
  });

  it('should handle multiple concurrent requests', () => {
    service.show();
    service.show();
    expect(service.loading()).toBe(true);

    service.hide();
    expect(service.loading()).toBe(true);

    service.hide();
    expect(service.loading()).toBe(false);
  });

  it('should not go below zero on hide() without show()', () => {
    service.hide();
    expect(service.loading()).toBe(false);
  });
});
