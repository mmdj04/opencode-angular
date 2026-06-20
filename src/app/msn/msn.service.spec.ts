import { TestBed } from '@angular/core/testing';
import { MsnService } from './msn.service';

describe('MsnService', () => {
  let service: MsnService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have quickLinks', () => {
    expect(service.quickLinks.length).toBe(6);
  });

  it('should have tabs', () => {
    expect(service.tabs.length).toBe(6);
  });

  it('should have articles', () => {
    expect(service.articles.length).toBe(12);
  });

  it('should return all articles for discover category', () => {
    const results = service.getArticlesByCategory('discover');

    expect(results.length).toBe(service.articles.length);
  });

  it('should filter articles by category', () => {
    const results = service.getArticlesByCategory('worldcup');

    expect(results.length).toBe(1);
    expect(results[0]?.category).toBe('worldcup');
  });

  it('should return empty array for nonexistent category', () => {
    const results = service.getArticlesByCategory('nonexistent');

    expect(results.length).toBe(0);
  });

  it('should have quickLinks with required fields', () => {
    service.quickLinks.forEach((link) => {
      expect(link.name).toBeTruthy();
      expect(link.url).toBeTruthy();
      expect(link.icon).toBeTruthy();
    });
  });

  it('should have tabs with required fields', () => {
    service.tabs.forEach((tab) => {
      expect(tab.id).toBeTruthy();
      expect(tab.label).toBeTruthy();
    });
  });

  it('should have articles with required fields', () => {
    service.articles.forEach((article) => {
      expect(article.id).toBeTruthy();
      expect(article.slug).toBeTruthy();
      expect(article.title).toBeTruthy();
      expect(article.source).toBeTruthy();
      expect(article.category).toBeTruthy();
    });
  });
});
