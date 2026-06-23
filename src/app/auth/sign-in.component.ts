import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, NgIcon, HlmButtonImports, HlmCardImports],
  providers: [provideIcons({ lucideGithub })],
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

            <!-- GitHub Button -->
            <button hlmBtn variant="outline" class="w-full" (click)="onGithub()">
              <ng-icon hlmIcon name="lucideGithub" class="mr-2" />
              Continue with GitHub
            </button>

            <!-- Notice -->
            <p class="text-muted-foreground mt-4 text-center text-xs">
              Currently, only GitHub users can create an account.
            </p>

            <!-- Footer -->
            <p class="text-muted-foreground mt-6 text-center text-sm">
              Don't have an account?
              <a routerLink="/sign-up" class="text-primary hover:underline">Sign up</a>
            </p>
          </div>
        </hlm-card>
      </div>
    </div>
  `,
})
export class SignInComponent {
  private readonly auth = inject(AuthService);

  async onGithub(): Promise<void> {
    try {
      await this.auth.signInWithGitHub();
    } catch {
      // Error handled by AuthService
    }
  }
}
