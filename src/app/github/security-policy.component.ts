import { Component } from '@angular/core';
import { SECURITY_POLICY } from './security-content';

@Component({
  selector: 'app-security-policy',
  template: `
    <!-- SECURITY.md card -->
    <div class="mb-8 border border-[#21262d]">
      <div class="flex items-center justify-between border-b border-[#21262d] px-4 py-3">
        <div class="flex items-center gap-2">
          <span class="text-foreground text-[14px] font-semibold">SECURITY.md</span>
        </div>
      </div>

      <div class="p-6">
        @for (section of sections; track section.title) {
          <div class="mb-6">
            <h2 class="mb-3 text-[16px] font-semibold text-[#e0e0e0]">{{ section.title }}</h2>

            @if (section.content) {
              @for (
                paragraph of section.content.split(
                  '

'
                );
                track paragraph
              ) {
                <p class="mb-4 text-[14px] leading-relaxed text-[#e0e0e0]">{{ paragraph }}</p>
              }
            }

            @if (section.type === 'list' && section.items) {
              <ul
                class="mb-6 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[#e0e0e0]"
              >
                @for (item of section.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            }

            @if (section.type === 'table' && section.table) {
              <div class="mb-4 overflow-x-auto">
                <table class="w-full border-collapse text-[14px] text-[#e0e0e0]">
                  <thead>
                    <tr class="border-b border-[#21262d]">
                      @for (header of section.table.headers; track header) {
                        <th class="px-4 py-2 text-left font-semibold">{{ header }}</th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of section.table.rows; track row) {
                      <tr class="border-b border-[#21262d]">
                        @for (cell of row; track cell) {
                          <td class="px-4 py-2">{{ cell }}</td>
                        }
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            @if (section.type === 'code' && section.code) {
              <div class="mb-4 overflow-x-auto rounded-md bg-[#010409] p-4">
                <pre
                  class="font-mono text-[13px] text-[#d1d5db]"
                ><code>{{ section.code }}</code></pre>
              </div>
            }

            @if (section.subsections) {
              @for (sub of section.subsections; track sub.title) {
                <div class="mb-4 ml-4">
                  <h3 class="mb-2 text-[14px] font-semibold text-[#e0e0e0]">{{ sub.title }}</h3>

                  @if (sub.content) {
                    @for (
                      paragraph of sub.content.split(
                        '

'
                      );
                      track paragraph
                    ) {
                      <p class="mb-3 text-[14px] leading-relaxed text-[#e0e0e0]">{{ paragraph }}</p>
                    }
                  }

                  @if (sub.type === 'list' && sub.items) {
                    <ul
                      class="mb-4 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[#e0e0e0]"
                    >
                      @for (item of sub.items; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  }

                  @if (sub.type === 'table' && sub.table) {
                    <div class="mb-4 overflow-x-auto">
                      <table class="w-full border-collapse text-[14px] text-[#e0e0e0]">
                        <thead>
                          <tr class="border-b border-[#21262d]">
                            @for (header of sub.table.headers; track header) {
                              <th class="px-4 py-2 text-left font-semibold">{{ header }}</th>
                            }
                          </tr>
                        </thead>
                        <tbody>
                          @for (row of sub.table.rows; track row) {
                            <tr class="border-b border-[#21262d]">
                              @for (cell of row; track cell) {
                                <td class="px-4 py-2">{{ cell }}</td>
                              }
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }

                  @if (sub.type === 'code' && sub.code) {
                    <div class="mb-4 overflow-x-auto rounded-md bg-[#010409] p-4">
                      <pre
                        class="font-mono text-[13px] text-[#d1d5db]"
                      ><code>{{ sub.code }}</code></pre>
                    </div>
                  }

                  @if (sub.subsections) {
                    @for (nested of sub.subsections; track nested.title) {
                      <div class="mb-3 ml-4">
                        <h4 class="mb-2 text-[13px] font-semibold text-[#e0e0e0]">
                          {{ nested.title }}
                        </h4>

                        @if (nested.type === 'list' && nested.items) {
                          <ul
                            class="mb-3 list-inside list-disc space-y-1 text-[13px] leading-relaxed text-[#e0e0e0]"
                          >
                            @for (item of nested.items; track item) {
                              <li>{{ item }}</li>
                            }
                          </ul>
                        }

                        @if (nested.type === 'table' && nested.table) {
                          <div class="mb-3 overflow-x-auto">
                            <table class="w-full border-collapse text-[13px] text-[#e0e0e0]">
                              <thead>
                                <tr class="border-b border-[#21262d]">
                                  @for (header of nested.table.headers; track header) {
                                    <th class="px-4 py-2 text-left font-semibold">{{ header }}</th>
                                  }
                                </tr>
                              </thead>
                              <tbody>
                                @for (row of nested.table.rows; track row) {
                                  <tr class="border-b border-[#21262d]">
                                    @for (cell of row; track cell) {
                                      <td class="px-4 py-2">{{ cell }}</td>
                                    }
                                  </tr>
                                }
                              </tbody>
                            </table>
                          </div>
                        }
                      </div>
                    }
                  }
                </div>
              }
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class SecurityPolicyComponent {
  sections = SECURITY_POLICY.sections;
}
