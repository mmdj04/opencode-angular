---
name: primeng-integration
description: Integrate PrimeNG 21 components correctly with proper imports, theming, and pt-BR translations. Use when the user asks to add, use, or configure a PrimeNG component.
license: MIT
compatibility: opencode
metadata:
  framework: angular
  library: primeng
  version: '21'
---

## What I do

I ensure PrimeNG 21 components are integrated correctly:

- Individual module imports (no barrel imports)
- Correct theming with `providePrimeNG()` and Aura theme
- pt-BR translations with correct accented characters
- cssLayer compatibility
- Proper event handling and template usage

## When to use me

Use this skill when:

- Adding a new PrimeNG component to a page
- Configuring PrimeNG theming
- Debugging PrimeNG component issues
- Setting up PrimeNG forms with validation
- Using PrimeNG templates and content projection

## PrimeNG Config (already in app.config.ts)

```typescript
providePrimeNG({
  ripple: true,
  inputVariant: 'filled',
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: {
        name: 'primeng',
        order: 'tailwind-base, primeng, tailwind-utilities',
      },
    },
  },
  translation: ptBRTranslation,
});
```

## Common Components

### Table

```typescript
import { TableModule } from 'primeng/table';

@Component({
  imports: [TableModule],
  template: `
    <p-table [value]="data()" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template pTemplate="header">
        <tr>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
```

### Dialog

```typescript
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [DialogModule, ButtonModule],
  template: `
    <p-button label="Open" (onClick)="visible.set(true)" />
    <p-dialog header="Title" [visible]="visible()" (onHide)="visible.set(false)">
      <p>Content here</p>
    </p-dialog>
  `,
})
```

### Toast

```typescript
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  imports: [ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <p-button label="Notify" (onClick)="showToast()" />
  `,
})
export class MyComponent {
  private readonly messageService = inject(MessageService);

  showToast(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Operation completed',
    });
  }
}
```

### Forms

```typescript
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Textarea } from 'primeng/textarea';

@Component({
  imports: [InputTextModule, FloatLabel, Textarea],
  template: `
    <p-floatlabel>
      <input pInputText id="name" [(ngModel)]="name" />
      <label for="name">Name</label>
    </p-floatlabel>
  `,
})
```

## Rules

1. Import PrimeNG modules individually — never from barrel `primeng`
2. Always use `pButton`, `pInputText`, etc. directives with `p-` prefix
3. Use `pTemplate` for table/column templates
4. Use `MessageService` for toast notifications (inject in component providers)
5. Use `[(ngModel)]` for two-way binding in templates
6. Use `FloatLabel` for accessible floating labels
7. Use correct pt-BR translations (accented characters: ç, ã, é, etc.)
8. Check cssLayer compatibility — custom styles may need `@layer utilities`
9. Use `p-table` with `[value]` array and `ng-template` for rows
10. Use `p-dialog` with `[visible]` signal and `(onHide)` event
