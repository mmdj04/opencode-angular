---
name: angular-test
description: Write Vitest unit tests for Angular components and services. Use when the user asks to write, create, or fix tests for Angular code.
license: MIT
compatibility: opencode
metadata:
  framework: angular
  test-runner: vitest
  version: '22'
---

## What I do

I generate Vitest unit tests for Angular 22 that follow project conventions:

- Vitest (`vi.spyOn`, `describe`, `it`, `expect`) — NOT Jasmine
- Angular Testing Utilities (`TestBed`, `ComponentFixture`)
- Functional interceptor testing with `provideHttpClient(withInterceptors([...]))`
- Proper cleanup with `TestBed.resetTestingModule()`
- Coverage thresholds: 60% statements, 60% branches, 60% functions, 60% lines

## When to use me

Use this skill when:

- Writing unit tests for a new component
- Writing unit tests for a new service
- Writing tests for HTTP interceptors
- Fixing broken tests
- Improving test coverage

## Component Test Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello');
  });
});
```

## Service Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data', () => {
    service.loadData();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Test' }]);

    expect(service.data().length).toBe(1);
  });
});
```

## Interceptor Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { myInterceptor } from './my.interceptor';

describe('myInterceptor', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should add headers', () => {
    TestBed.inject(HttpClient).get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('X-Custom')).toBe('value');
    req.flush({});
  });
});
```

## Rules

1. Always use `vi.spyOn()` — never `spyOn()` (Jasmine)
2. Always use `TestBed.resetTestingModule()` in `afterEach`
3. Test interceptors with `provideHttpClient(withInterceptors([...]))` not `HTTP_INTERCEPTORS`
4. Use `HttpTestingController` for HTTP mocking
5. Always call `httpMock.verify()` in `afterEach`
6. Use `describe`/`it`/`expect` from Vitest
7. Use `toBe(true)`/`toBe(false)` — not `toBeTrue()`/`toBeFalse()`
8. Use `fixture.detectChanges()` to trigger change detection
9. Use `fixture.nativeElement` for DOM assertions
10. Name test files `<name>.spec.ts` next to source
