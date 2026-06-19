import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../services/loading.service';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let httpMock: HttpTestingController;

  let httpClient: HttpClient;

  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        LoadingService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set loading true on request and false on complete', () => {
    expect(loadingService.loading()).toBe(false);

    httpClient.get('/api/test').subscribe();

    expect(loadingService.loading()).toBe(true);

    const req = httpMock.expectOne('/api/test');

    req.flush({ data: 'ok' });

    expect(loadingService.loading()).toBe(false);
  });

  it('should handle multiple concurrent requests', () => {
    httpClient.get('/api/test1').subscribe();
    httpClient.get('/api/test2').subscribe();

    expect(loadingService.loading()).toBe(true);

    const req1 = httpMock.expectOne('/api/test1');

    req1.flush({ data: 'ok' });

    expect(loadingService.loading()).toBe(true);

    const req2 = httpMock.expectOne('/api/test2');

    req2.flush({ data: 'ok' });

    expect(loadingService.loading()).toBe(false);
  });

  it('should set loading false on error', () => {
    httpClient.get('/api/test').subscribe({
      error: (e: unknown) => {
        void e;
      },
    });

    expect(loadingService.loading()).toBe(true);

    const req = httpMock.expectOne('/api/test');

    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(loadingService.loading()).toBe(false);
  });
});
