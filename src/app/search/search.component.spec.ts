import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render logo text', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork');
  });

  it('should render search input', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('input[type="search"]');

    expect(input).toBeTruthy();
  });

  it('should render action buttons', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork Search');
    expect(compiled.textContent).toContain('Estou com sorte');
  });

  it('should render footer', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Brasil');
    expect(compiled.textContent).toContain('Privacidade');
    expect(compiled.textContent).toContain('Termos');
  });

  it('should render language links as buttons', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('English');
    expect(compiled.textContent).toContain('Português (Brasil)');

    const buttons = compiled.querySelectorAll('button');

    const langButtons = Array.from(buttons).filter(
      (b) =>
        b.textContent?.includes('English') ||
        b.textContent?.includes('Español') ||
        b.textContent?.includes('Français') ||
        b.textContent?.includes('日本語') ||
        b.textContent?.includes('Português'),
    );

    expect(langButtons.length).toBe(5);
  });

  it('should navigate with query on search()', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    const router = TestBed.inject(Router);

    const spy = vi.spyOn(router, 'navigate');

    (fixture.componentInstance as unknown as Record<string, unknown>).query.set('angular test');
    fixture.componentInstance.search();
    expect(spy).toHaveBeenCalledWith(['/search/results'], { queryParams: { q: 'angular test' } });
  });

  it('should not navigate on search() with empty query', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    const router = TestBed.inject(Router);

    const spy = vi.spyOn(router, 'navigate');

    (fixture.componentInstance as unknown as Record<string, unknown>).query.set('');
    fixture.componentInstance.search();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should navigate on feelingLucky()', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    const router = TestBed.inject(Router);

    const spy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.feelingLucky();
    expect(spy).toHaveBeenCalledWith(['/search/results'], { queryParams: { q: 'sorte' } });
  });

  it('should render separator in footer', () => {
    const fixture = TestBed.createComponent(SearchComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const footer = compiled.querySelector('footer');

    expect(footer).toBeTruthy();
  });
});
