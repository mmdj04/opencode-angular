import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-security',
  imports: [RouterLink],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Header -->
      <header class="border-border bg-background sticky top-0 z-50 border-b">
        <div class="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-3">
          <a routerLink="/github" class="text-foreground shrink-0 text-xl font-bold hover:no-underline">
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

        <!-- SECURITY.md card -->
        <div class="mb-8 border border-[#21262d]">
          <!-- Card header -->
          <div class="flex items-center justify-between border-b border-[#21262d] px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="text-foreground text-[14px] font-semibold">SECURITY.md</span>
            </div>
            <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
              <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L3.46 11.1a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.25.25 0 00.108-.064l8.61-8.61a.25.25 0 000-.354L12.427 2.487z" />
            </svg>
          </div>

          <!-- Card content -->
          <div class="p-6">
            <!-- Contact -->
            <p class="mb-4 text-[14px] text-[#e0e0e0]">
              <strong>Contact:</strong>
              <a href="https://hackerone.com/agentwork" class="text-[#58a6ff] hover:underline">https://hackerone.com/agentwork</a>
              &nbsp;Canonical:
              <a href="https://agentwork.com/.well-known/security.txt" class="text-[#58a6ff] hover:underline">https://agentwork.com/.well-known/security.txt</a>
            </p>

            <!-- Introduction -->
            <p class="mb-4 text-[14px] leading-relaxed text-[#e0e0e0]">
              At Agentwork, we consider the security of our AI systems a top priority. But no matter how much
              effort we put into system security, there can still be vulnerabilities present.
            </p>

            <p class="mb-4 text-[14px] leading-relaxed text-[#e0e0e0]">
              If you discover a vulnerability, we would like to know about it so we can take steps to address it
              as quickly as possible. We would like to ask you to help us better protect our clients and our
              systems.
            </p>

            <p class="mb-6 text-[14px] leading-relaxed text-[#e0e0e0]">
              The full scope of our VDP is available at
              <a href="https://hackerone.com/agentwork" class="text-[#58a6ff] hover:underline">https://hackerone.com/agentwork</a>.
            </p>

            <!-- Out of scope -->
            <p class="mb-3 text-[14px] font-semibold text-[#e0e0e0]">
              Here is a brief list of some common out of scope vulnerabilities:
            </p>

            <ul class="mb-6 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[#e0e0e0]">
              <li>Clickjacking on pages with no sensitive actions.</li>
              <li>Unauthenticated/logout/login CSRF.</li>
              <li>Attacks requiring MITM or physical access to a user's device.</li>
              <li>Attacks requiring social engineering.</li>
              <li>Any activity that could lead to the disruption of our service (DoS).</li>
              <li>Content spoofing and text injection issues without showing an attack vector/without being able to modify HTML/CSS.</li>
              <li>Email spoofing</li>
              <li>Missing DNSSEC, CAA, CSP headers</li>
              <li>Lack of Secure or HTTP only flag on non-sensitive cookies</li>
              <li>Deadlinks</li>
              <li>User enumeration</li>
            </ul>

            <!-- Testing guidelines -->
            <p class="mb-3 text-[14px] font-semibold text-[#e0e0e0]">Testing guidelines:</p>

            <ul class="mb-6 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[#e0e0e0]">
              <li>
                Do not run automated scanners on other customer projects. Running automated scanners
                can run up costs for our users. Aggressively configured scanners might inadvertently disrupt
                services, exploit vulnerabilities, lead to system instability or breaches and violate Terms of
                Service from our upstream providers. Our own security systems won't be able to distinguish
                hostile reconnaissance from whitehat research. If you wish to run an automated scanner,
                notify us at
                <a href="mailto:security@agentwork.com" class="text-[#58a6ff] hover:underline">security@agentwork.com</a>
                and only run it on your own Agentwork project. Do NOT
                attack projects of other customers.
              </li>
              <li>
                Do not take advantage of the vulnerability or problem you have discovered, for example by
                downloading more data than necessary to demonstrate the vulnerability or deleting or
                modifying other people's data.
              </li>
            </ul>

            <!-- Reporting guidelines -->
            <p class="mb-3 text-[14px] font-semibold text-[#e0e0e0]">Reporting guidelines:</p>

            <ul class="mb-6 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[#e0e0e0]">
              <li>File a report through our VDP at <a href="https://hackerone.com/agentwork" class="text-[#58a6ff] hover:underline">https://hackerone.com/agentwork</a></li>
              <li>Do provide sufficient information to reproduce the problem, so we will be able to resolve it as quickly as possible.</li>
            </ul>

            <!-- Disclosure guidelines -->
            <p class="mb-3 text-[14px] font-semibold text-[#e0e0e0]">Disclosure guidelines:</p>

            <ul class="mb-6 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[#e0e0e0]">
              <li>
                In order to protect our customers, do not reveal the problem to others until we have
                researched, addressed and informed our affected customers.
              </li>
              <li>
                If you want to publicly share your research about Agentwork at a conference, in a blog or any
                other public forum, you should share a draft with us for review and approval at least 30 days
                prior to the publication date. Please note that the following should not be included:
                <ul class="ml-6 mt-1 list-inside list-disc space-y-1">
                  <li>Data regarding any Agentwork customer projects</li>
                  <li>Agentwork customers' data</li>
                  <li>Information about Agentwork employees, contractors or partners</li>
                </ul>
              </li>
            </ul>

            <!-- What we promise -->
            <p class="mb-3 text-[14px] font-semibold text-[#e0e0e0]">What we promise:</p>

            <ul class="mb-6 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[#e0e0e0]">
              <li>
                We will respond to your report within 5 business days with our evaluation and
                an expected resolution date.
              </li>
              <li>
                If you have followed the instructions above, we will not take any legal action against
                you in regard to the report.
              </li>
              <li>
                We will handle your report with strict confidentiality, and not pass on your personal details to
                third parties without your permission.
              </li>
              <li>
                We will keep you informed of the progress towards resolving the problem.
              </li>
              <li>
                In the public information concerning the problem reported, we will give your name as the
                discoverer of the problem (unless you desire otherwise).
              </li>
            </ul>

            <p class="text-[14px] leading-relaxed text-[#e0e0e0]">
              We strive to resolve all problems as quickly as possible, and we would like to play an active role in
              the ultimate publication on the problem after it is resolved.
            </p>
          </div>
        </div>

        <!-- Security advisories -->
        <div class="border border-[#21262d]">
          <div class="border-b border-[#21262d] px-4 py-3">
            <span class="text-foreground text-[14px] font-semibold">Security advisories</span>
          </div>
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <svg viewBox="0 0 16 16" class="text-muted-foreground mb-3 h-8 w-8 fill-current">
              <path d="M7.467.133a1.75 1.75 0 011.066 0l5.25 1.68A1.75 1.75 0 0115 3.48V7c0 1.566-.32 3.18-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.7 1.7 0 01-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.18 1 8.564 1 7V3.48a1.75 1.75 0 011.217-1.667l5.25-1.68zm.61 1.429a.25.25 0 00-.153 0l-5.25 1.68a.25.25 0 00-.174.238V7c0 1.358.275 2.666 1.057 3.86.784 1.194 2.121 2.34 4.366 3.297a.2.2 0 00.154 0c2.245-.956 3.582-2.104 4.366-3.298C13.225 9.666 13.5 8.36 13.5 7V3.48a.25.25 0 00-.174-.237l-5.25-1.68z" />
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
          <div class="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-[13px]">
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
