import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import {
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { ThemeService } from './core/services/theme.service';
import { AgentworkNewsService } from './agentwork-news/agentwork-news.service';
import { AuthService } from './core/services/auth.service';

function initializeTheme(): void {
  inject(ThemeService).init();
}

function initializeNews(): void {
  inject(AgentworkNewsService).init();
}

function initializeAuth(): void {
  inject(AuthService).loadSession();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor])),
    provideAppInitializer(initializeTheme),
    provideAppInitializer(initializeNews),
    provideAppInitializer(initializeAuth),
  ],
};
