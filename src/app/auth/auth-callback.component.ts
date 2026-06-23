import { Component, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SupabaseService } from '../core/services/supabase.service';

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
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;

      // If already logged in (from initializeAuth), navigate immediately
      if (this.auth.isLoggedIn()) {
        this.router.navigate(['/settings']);
        return;
      }

      // Wait for onAuthStateChange to fire with the session
      const { data } = this.supabase.supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          this.auth.session.set(session);
          this.auth.user.set(session.user);
          this.auth.authLoaded.set(true);
          this.router.navigate(['/settings']);
        } else {
          this.router.navigate(['/sign-in']);
        }
      });

      // Cleanup subscription on component destroy (handled by Angular lifecycle)
      // The subscription is stored but we don't need to manually unsubscribe
      // since the component is destroyed after navigation
      void data;
    });
  }
}
