import { TestBed } from '@angular/core/testing';
import { NewsArticleService } from './news-article.service';

describe('NewsArticleService', () => {
  let service: NewsArticleService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return article for valid slug', () => {
    const article = service.getArticle('analfabetismo-no-brasil-cai-para-4-9');

    expect(article).toBeTruthy();
    expect(article?.slug).toBe('analfabetismo-no-brasil-cai-para-4-9');
  });

  it('should return undefined for invalid slug', () => {
    const article = service.getArticle('nonexistent-slug');

    expect(article).toBeUndefined();
  });

  it('should return all slugs', () => {
    const slugs = service.getAllSlugs();

    expect(slugs.length).toBe(3);
    slugs.forEach((slug) => {
      expect(typeof slug).toBe('string');
      expect(slug.length).toBeGreaterThan(0);
    });
  });

  it('should return related articles', () => {
    const related = service.getRelatedArticles();

    expect(related.length).toBeGreaterThan(0);
    related.forEach((article) => {
      expect(article.id).toBeTruthy();
      expect(article.title).toBeTruthy();
      expect(article.source).toBeTruthy();
    });
  });

  it('should filter moreFromSource by brasil and economia categories', () => {
    const more = service.getMoreFromSource();

    expect(more.length).toBeGreaterThan(0);
    more.forEach((article) => {
      expect(['brasil', 'economia']).toContain(article.category);
    });
  });

  it('should return article with paragraphs', () => {
    const article = service.getArticle('analfabetismo-no-brasil-cai-para-4-9');

    expect(article?.paragraphs.length).toBeGreaterThan(0);
    article?.paragraphs.forEach((p) => {
      expect(p.text).toBeTruthy();
    });
  });

  it('should return article with tags', () => {
    const article = service.getArticle('analfabetismo-no-brasil-cai-para-4-9');

    expect(article?.tags.length).toBeGreaterThan(0);
  });
});
