---
name: angular-service
description: Create Angular 22 services using signals, inject(), and modern patterns. Use when the user asks to create a new service, API service, or state management service.
license: MIT
compatibility: opencode
metadata:
  framework: angular
  version: '22'
---

## What I do

I generate Angular 22 services following project conventions:

- `inject()` for dependency injection
- Signals for state management (`signal()`, `computed()`)
- `HttpClient` with functional interceptors
- Proper error handling with `catchError`
- Singleton services provided in `root` or explicitly
- `import type` for type-only imports

## When to use me

Use this skill when:

- Creating a new Angular service
- Building an API service with HttpClient
- Creating a state management service with signals
- Adding a loading/error handling service

## Service Template

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, finalize } from 'rxjs';

interface Item {
  readonly id: string;
  readonly name: string;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);

  private readonly _items = signal<readonly Item[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasItems = computed(() => this._items().length > 0);

  loadItems(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<readonly Item[]>('/api/items')
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this._error.set(err.message);
          return throwError(() => err);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe((items) => this._items.set(items));
  }
}
```

## Rules

1. Always use `inject()` — never constructor injection
2. Use `signal()` for mutable state, `computed()` for derived values
3. Expose readonly signals via `.asReadonly()`
4. Use `providedIn: 'root'` for singletons
5. Handle errors with `catchError` and `HttpErrorResponse`
6. Use `finalize()` for cleanup (loading state, subscriptions)
7. Define interfaces in the same file or in a shared types file
8. Never expose mutable signals — always use `asReadonly()`
9. Add `.spec.ts` test file next to the service
10. Test with `TestBed.configureTestingModule({ providers: [...] })`
