import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideLock, lucideMail, lucideShield } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-sign-in',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparatorImports,
  ],
  providers: [provideIcons({ lucideGithub, lucideMail, lucideLock, lucideShield })],
  template: `
    <div class="bg-background flex min-h-screen items-center justify-center p-4">
      <div class="w-full max-w-[400px]">
        <!-- Logo -->
        <div class="mb-8">
          <span class="text-foreground text-xl font-semibold">Agentwork</span>
        </div>

        <!-- Card -->
        <hlm-card>
          <div class="p-8">
            <!-- Header -->
            <h1 class="text-foreground mb-1 text-2xl font-semibold">Welcome back</h1>
            <p class="text-muted-foreground mb-6 text-sm">Sign in to your account</p>

            <!-- Social Buttons -->
            <div class="mb-4 space-y-3">
              <button hlmBtn variant="outline" class="w-full" (click)="onGithub()">
                <ng-icon hlmIcon name="lucideGithub" class="mr-2" />
                Continue with GitHub
              </button>
              <button hlmBtn variant="outline" class="w-full" (click)="onSSO()">
                <ng-icon hlmIcon name="lucideShield" class="mr-2" />
                Continue with SSO
              </button>
            </div>

            <!-- Divider -->
            <div class="relative my-6">
              <div hlmSeparator></div>
              <span
                class="bg-card text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs"
              >
                or
              </span>
            </div>

            <!-- Form -->
            <form (ngSubmit)="onSubmit()">
              <div class="mb-4 space-y-2">
                <label hlmLabel for="email">Email</label>
                <input
                  hlmInput
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  [(ngModel)]="email"
                  name="email"
                  class="w-full"
                />
              </div>

              <div class="mb-4 space-y-2">
                <div class="flex items-center justify-between">
                  <label hlmLabel for="password">Password</label>
                  <a routerLink="/forgot-password" class="text-primary text-xs hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  hlmInput
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="••••••••"
                  [(ngModel)]="password"
                  name="password"
                  class="w-full"
                />
              </div>

              <button hlmBtn type="submit" class="w-full">Sign in</button>
            </form>

            <!-- Footer -->
            <p class="text-muted-foreground mt-6 text-center text-sm">
              Don't have an account?
              <a routerLink="/sign-up" class="text-primary hover:underline">Sign up</a>
            </p>
          </div>
        </hlm-card>

        <!-- Terms -->
        <p class="text-muted-foreground mt-6 text-center text-xs leading-relaxed">
          By continuing, you agree to Supabase's
          <a href="https://supabase.com/terms" class="hover:underline" target="_blank"
            >Terms of Service</a
          >
          and
          <a href="https://supabase.com/privacy" class="hover:underline" target="_blank"
            >Privacy Policy</a
          >, and to receive periodic emails with updates.
        </p>
      </div>
    </div>
  `,
})
export class SignInComponent {
  email = '';
  password = '';
  showPassword = signal(false);

  onGithub() {
    console.warn('Sign in with GitHub');
  }

  onSSO() {
    console.warn('Sign in with SSO');
  }

  onSubmit() {
    console.warn('Sign in:', { email: this.email, password: this.password });
  }
}
