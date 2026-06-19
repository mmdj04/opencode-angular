---
name: angular-component
description: Create properly structured Angular 22 standalone components following project conventions. Use when the user asks to create, generate, or scaffold a new Angular component.
license: MIT
compatibility: opencode
metadata:
  framework: angular
  version: '22'
---

## What I do

I generate Angular 22 standalone components that follow all project conventions:

- Standalone components (no NgModule)
- Signals-first (`signal()`, `computed()`, `effect()`)
- Modern control flow (`@if`, `@for`, `@switch`)
- `inject()` for dependency injection
- Single-file with inline template and style
- `app-` selector prefix
- `import type` for type-only imports

## When to use me

Use this skill when:

- Creating a new Angular component from scratch
- Scaffolding a feature component
- Generating a UI component with PrimeNG integration

## Component Template

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { SomeService } from '../core/services/some.service';

@Component({
  selector: 'app-<name>',
  template: `
    @if (loading()) {
      <p-progress-spinner />
    } @else {
      <div class="...">
        @for (item of items(); track item.id) {
          <div>{{ item.name }}</div>
        }
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class <Name>Component {
  private readonly service = inject(SomeService);

  readonly loading = signal(false);
  readonly items = computed(() => this.service.items());
}
```

## Rules

1. Always use `signal()` for mutable state — never BehaviorSubject for UI state
2. Always use `computed()` for derived values
3. Always use `@if`/`@for`/`@switch` — never `*ngIf`/`*ngFor`/`*ngSwitch`
4. Always use `inject()` — never constructor injection
5. Always use `import type` for type-only imports
6. Keep components in a single `.ts` file with inline template/style
7. Use `app-` prefix for selectors
8. Place feature components in `src/app/<feature>/`
9. Export components explicitly (no barrel exports)
10. Add `.spec.ts` test file next to the component
