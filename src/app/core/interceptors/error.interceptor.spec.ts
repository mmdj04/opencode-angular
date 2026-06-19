import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as sonner from '@spartan-ng/brain/sonner';
import { errorInterceptor } from './error.interceptor';

vi.mock('@spartan-ng/brain/sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;

  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    vi.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpClient).toBeTruthy();
  });

  it('should add error toast on HTTP error', () => {
    httpClient.get('/api/test').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne('/api/test');

    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(sonner.toast.error).toHaveBeenCalledWith(
      'Http failure response for /api/test: 404 Not Found',
    );
  });

  it('should not add toast on successful response', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');

    req.flush({ data: 'ok' });

    expect(sonner.toast.error).not.toHaveBeenCalled();
  });
});
