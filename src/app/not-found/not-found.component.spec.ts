import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render 404', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('404');
  });

  it('should render not found message', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Página não encontrada');
  });

  it('should render link to home', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const link = compiled.querySelector('a');

    expect(link).toBeTruthy();
    expect(compiled.textContent).toContain('Voltar para o início');
  });

  it('should render description text', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('O link que você segue pode estar quebrado');
  });

  it('should render search icon', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const icons = compiled.querySelectorAll('ng-icon');

    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render card', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const card = compiled.querySelector('[data-slot="card"]');

    expect(card).toBeTruthy();
  });
});
