import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    RouterLink,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparatorImports,
  ],
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
            <h1 class="text-foreground mb-1 text-2xl font-semibold">Forgot your password?</h1>
            <p class="text-muted-foreground mb-6 text-sm">
              Enter your email and we'll send you a code to reset the password
            </p>

            <!-- Form -->
            <form (ngSubmit)="onSubmit()">
              <div class="mb-6 space-y-2">
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

              <div hlmSeparator class="mb-6"></div>

              <button
                hlmBtn
                type="submit"
                class="w-full bg-green-500 text-white hover:bg-green-600"
              >
                Send reset code
              </button>
            </form>

            <!-- Footer -->
            <p class="text-muted-foreground mt-6 text-center text-sm">
              Already have an account?
              <a routerLink="/sign-in" class="text-primary hover:underline">Sign In</a>
            </p>
          </div>
        </hlm-card>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  email = '';

  onSubmit() {
    console.warn('Forgot password:', { email: this.email });
  }
}
