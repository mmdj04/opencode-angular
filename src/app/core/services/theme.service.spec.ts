import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    localStorage.clear();
    document.documentElement.classList.remove('dark');

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isDark false', () => {
    expect(service.isDark()).toBe(false);
  });

  it('should toggle isDark', () => {
    service.toggle();
    expect(service.isDark()).toBe(true);

    service.toggle();
    expect(service.isDark()).toBe(false);
  });

  it('should save theme to localStorage on toggle', () => {
    service.toggle();
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggle();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should add dark class to documentElement on toggle', () => {
    service.toggle();
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    service.toggle();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should initialize with saved dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    service.init();
    expect(service.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should initialize with saved light theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    service.init();
    expect(service.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should not change isDark when init is called without localStorage and prefers light', () => {
    service.init();
    expect(service.isDark()).toBe(false);
  });
});
