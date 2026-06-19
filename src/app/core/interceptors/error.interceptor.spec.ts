import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;

  let httpClient: HttpClient;

  let messageService: MessageService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        MessageService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    messageService = TestBed.inject(MessageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpClient).toBeTruthy();
  });

  it('should add error toast on HTTP error', () => {
    const addSpy = vi.spyOn(messageService, 'add');

    httpClient.get('/api/test').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne('/api/test');

    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(addSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Http failure response for /api/test: 404 Not Found',
    });
  });

  it('should not add toast on successful response', () => {
    const addSpy = vi.spyOn(messageService, 'add');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');

    req.flush({ data: 'ok' });

    expect(addSpy).not.toHaveBeenCalled();
  });
});
