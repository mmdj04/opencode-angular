import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all results when query is empty', () => {
    const results = service.search('');

    expect(results.length).toBe(12);
  });

  it('should return all results when query is null', () => {
    const results = service.search(null as unknown as string);

    expect(results.length).toBe(12);
  });

  it('should return all results when query is whitespace only', () => {
    const results = service.search('   ');

    expect(results.length).toBe(12);
  });

  it('should filter results by title', () => {
    const results = service.search('Angular');

    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => {
      const matches =
        r.title.toLowerCase().includes('angular') ||
        r.snippet.toLowerCase().includes('angular') ||
        r.domain.toLowerCase().includes('angular');

      expect(matches).toBe(true);
    });
  });

  it('should filter results by snippet', () => {
    const results = service.search('programação reativa');

    expect(results.length).toBe(1);
    expect(results[0]?.domain).toBe('rxjs.dev');
  });

  it('should filter results by domain', () => {
    const results = service.search('vitest.dev');

    expect(results.length).toBe(1);
    expect(results[0]?.domain).toBe('vitest.dev');
  });

  it('should be case-insensitive', () => {
    const lower = service.search('angular');

    const upper = service.search('ANGULAR');

    const mixed = service.search('aNgUlAr');

    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBe(mixed.length);
  });

  it('should handle trimmed query', () => {
    const results = service.search('  Angular  ');

    expect(results.length).toBeGreaterThan(0);
  });

  it('should return empty array when no results match', () => {
    const results = service.search('xyznonexistent');

    expect(results.length).toBe(0);
  });
});
