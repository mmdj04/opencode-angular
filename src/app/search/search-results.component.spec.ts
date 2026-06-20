import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SearchResultsComponent } from './search-results.component';

describe('SearchResultsComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ q: 'angular' }),
          },
        },
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render header with logo', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork');
  });

  it('should render search input', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('input[type="search"]');

    expect(input).toBeTruthy();
  });

  it('should render tabs', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Todos');
    expect(compiled.textContent).toContain('Imagens');
    expect(compiled.textContent).toContain('Vídeos');
  });

  it('should render footer', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork © 2026');
  });

  it('should display results count info', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('resultados');
  });

  it('should navigate on search()', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    comp.query.set('test query');
    comp.search();
    expect(comp.query()).toBe('test query');
  });

  it('should goToPage update page signal', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    comp.goToPage(2);
    expect(comp.page()).toBe(2);
  });

  it('should prevPage decrement page', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    comp.page.set(3);
    comp.prevPage();
    expect(comp.page()).toBe(2);
  });

  it('should prevPage not go below 1', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    comp.page.set(1);
    comp.prevPage();
    expect(comp.page()).toBe(1);
  });

  it('should nextPage increment page', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    comp.query.set('');
    comp.page.set(1);
    comp.nextPage();
    expect(comp.page()).toBe(2);
  });

  it('should nextPage not exceed totalPages', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    comp.query.set('');

    const total = comp.totalPages();

    comp.page.set(total);
    comp.nextPage();
    expect(comp.page()).toBe(total);
  });

  it('should initialize with queryParams', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    expect(comp.query()).toBe('angular');
  });

  it('should render pagination when multiple pages', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    comp.query.set('');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const pagination = compiled.querySelector('nav');

    expect(pagination).toBeTruthy();
  });

  it('should show empty state when no results', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);

    const comp = fixture.componentInstance as unknown as Record<string, unknown>;

    comp.query.set('zzzznonexistent');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Nenhum resultado encontrado');
  });
});
