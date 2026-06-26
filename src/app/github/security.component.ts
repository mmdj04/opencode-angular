import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SecurityPolicyComponent } from './security-policy.component';

@Component({
  selector: 'app-security',
  imports: [RouterLink, SecurityPolicyComponent],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Header -->
      <header class="border-border bg-background sticky top-0 z-50 border-b">
        <div class="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-3">
          <a
            routerLink="/github"
            class="text-foreground shrink-0 text-xl font-bold hover:no-underline"
          >
            Agentwork
          </a>
        </div>
      </header>

      <main class="mx-auto max-w-[1280px] px-6 py-6">
        <!-- Title row -->
        <div class="mb-6 flex items-center justify-between">
          <h1 class="text-foreground text-[24px] font-semibold">Security</h1>
          <button
            class="rounded-md bg-[#238636] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#2ea043]"
          >
            Report a vulnerability
          </button>
        </div>

        <!-- Shared security policy content -->
        <app-security-policy />

        <!-- Security advisories -->
        <div class="border border-[#21262d]">
          <div class="border-b border-[#21262d] px-4 py-3">
            <span class="text-foreground text-[14px] font-semibold">Security advisories</span>
          </div>
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <svg viewBox="0 0 16 16" class="text-muted-foreground mb-3 h-8 w-8 fill-current">
              <path
                d="M7.467.133a1.75 1.75 0 011.066 0l5.25 1.68A1.75 1.75 0 0115 3.48V7c0 1.566-.32 3.18-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.7 1.7 0 01-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.18 1 8.564 1 7V3.48a1.75 1.75 0 011.217-1.667l5.25-1.68zm.61 1.429a.25.25 0 00-.153 0l-5.25 1.68a.25.25 0 00-.174.238V7c0 1.358.275 2.666 1.057 3.86.784 1.194 2.121 2.34 4.366 3.297a.2.2 0 00.154 0c2.245-.956 3.582-2.104 4.366-3.298C13.225 9.666 13.5 8.36 13.5 7V3.48a.25.25 0 00-.174-.237l-5.25-1.68z"
              />
            </svg>
            <p class="text-muted-foreground text-[14px]">
              There aren't any published security advisories
            </p>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="border-border mt-8 border-t">
        <div class="mx-auto max-w-[1280px] px-6 py-6">
          <div
            class="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-[13px]"
          >
            <span>© 2026 Agentwork</span>
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Terms</a>
            <a href="#" class="hover:underline">About</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class SecurityComponent {}
