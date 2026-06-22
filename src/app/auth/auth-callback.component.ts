import { Component, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="bg-background flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="text-muted-foreground mb-4 text-[14px]">Signing in with GitHub...</div>
        <div class="border-muted-foreground mx-auto h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    afterNextRender(async () => {
      if (!this.isBrowser) return;

      try {
        await this.auth.loadSession();
        this.router.navigate(['/settings']);
      } catch {
        this.router.navigate(['/sign-in']);
      }
    });
  }
}
