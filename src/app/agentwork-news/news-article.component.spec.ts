import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NewsArticleComponent } from './news-article.component';

describe('NewsArticleComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ slug: 'analfabetismo-no-brasil-cai-para-4-9' }),
          },
        },
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render Agentwork News logo in header', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork News');
  });

  it('should render sign in button', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Sign in');
  });

  it('should render footer', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('© 2026 Agentwork');
  });

  it('should render article title', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Analfabetismo');
  });

  it('should render article author avatar', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const avatar = compiled.querySelector('hlm-avatar');

    expect(avatar).toBeTruthy();
  });

  it('should render breadcrumb', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Início');
  });

  it('should render tags', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Educação');
  });

  it('should render share buttons', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Compartilhar');
  });

  it('should render related articles', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Mais notícias');
  });

  it('should show 404 state for invalid slug', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'nonexistent-slug');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Artigo não encontrado');
    expect(compiled.textContent).toContain('Voltar ao Agentwork News');
  });

  it('should have computed article', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');

    const comp = fixture.componentInstance as any;

    expect(comp.article()).toBeTruthy();
  });

  it('should have computed relatedArticles', () => {
    const fixture = TestBed.createComponent(NewsArticleComponent);

    fixture.componentRef.setInput('slug', 'analfabetismo-no-brasil-cai-para-4-9');

    const comp = fixture.componentInstance as any;

    expect(comp.relatedArticles().length).toBeGreaterThan(0);
  });
});
