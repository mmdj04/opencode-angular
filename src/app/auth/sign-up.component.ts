import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideGithub, lucideMail } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-sign-up',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparatorImports,
  ],
  providers: [provideIcons({ lucideGithub, lucideMail, lucideCheck })],
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
            <h1 class="text-foreground mb-1 text-2xl font-semibold">Get started</h1>
            <p class="text-muted-foreground mb-6 text-sm">Create a new account</p>

            <!-- Social Buttons -->
            <div class="mb-4">
              <button hlmBtn variant="outline" class="w-full" (click)="onGithub()">
                <ng-icon hlmIcon name="lucideGithub" class="mr-2" />
                Continue with GitHub
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
                <label hlmLabel for="password">Password</label>
                <input
                  hlmInput
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="••••••••"
                  [(ngModel)]="password"
                  name="password"
                  class="w-full"
                />

                <!-- Password Requirements -->
                <div class="mt-3 space-y-1.5">
                  @for (req of passwordRequirements(); track req.label) {
                    <div class="flex items-center gap-2 text-xs">
                      <ng-icon
                        hlmIcon
                        [name]="req.met() ? 'lucideCheck' : 'lucideCheck'"
                        class="size-3"
                        [class]="req.met() ? 'text-green-500' : 'text-muted-foreground/40'"
                      />
                      <span [class]="req.met() ? 'text-foreground' : 'text-muted-foreground'">
                        {{ req.label }}
                      </span>
                    </div>
                  }
                </div>
              </div>

              <button hlmBtn type="submit" class="mt-6 w-full">Sign up</button>
            </form>

            <!-- Footer -->
            <p class="text-muted-foreground mt-6 text-center text-sm">
              Have an account?
              <a routerLink="/sign-in" class="text-primary hover:underline">Sign in</a>
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
export class SignUpComponent {
  email = '';
  password = '';
  showPassword = signal(false);

  passwordRequirements = computed(() => [
    { label: 'Uppercase letter', met: signal(/[A-Z]/.test(this.password)) },
    { label: 'Lowercase letter', met: signal(/[a-z]/.test(this.password)) },
    { label: 'Number', met: signal(/[0-9]/.test(this.password)) },
    {
      label: 'Special character (e.g. !?<>@#$%)',
      met: signal(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(this.password)),
    },
    { label: '8 characters or more', met: signal(this.password.length >= 8) },
  ]);

  onGithub() {
    console.warn('Sign up with GitHub');
  }

  onSubmit() {
    console.warn('Sign up:', { email: this.email, password: this.password });
  }
}
