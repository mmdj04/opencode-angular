import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { User, Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly user = signal<User | null>(null);
  readonly session = signal<Session | null>(null);
  readonly isLoggedIn = computed(() => !!this.user());
  readonly userEmail = computed(() => this.user()?.email ?? '');
  readonly userAvatar = computed(() => this.user()?.user_metadata?.['avatar_url'] ?? '');
  readonly userDisplayName = computed(
    () =>
      this.user()?.user_metadata?.['full_name'] ??
      this.user()?.user_metadata?.['name'] ??
      this.userEmail(),
  );

  async loadSession(): Promise<void> {
    if (!this.isBrowser) return;

    const { data } = await this.supabase.supabase.auth.getSession();
    this.session.set(data.session);
    this.user.set(data.session?.user ?? null);

    this.supabase.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
      this.user.set(session?.user ?? null);
    });
  }

  async signInWithGitHub(): Promise<void> {
    const { error } = await this.supabase.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('GitHub OAuth error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    this.user.set(null);
    this.session.set(null);
  }

  getAccessToken(): string | null {
    return this.session()?.access_token ?? null;
  }
}
