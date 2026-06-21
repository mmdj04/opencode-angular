import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AgentworkNewsComponent } from './agentwork-news.component';

describe('AgentworkNewsComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render Agentwork News logo', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork News');
  });

  it('should render quick links', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Outlook');
    expect(compiled.textContent).toContain('Booking');
    expect(compiled.textContent).toContain('YouTube');
  });

  it('should render tabs', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Discover');
    expect(compiled.textContent).toContain('News');
    expect(compiled.textContent).toContain('Sports');
  });

  it('should render articles', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Analfabetismo');
  });

  it('should render footer', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('© 2026 Agentwork');
    expect(compiled.textContent).toContain('Privacy');
    expect(compiled.textContent).toContain('Terms');
  });

  it('should render personalize button', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Personalize');
  });

  it('should render search input', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('input[type="search"]');

    expect(input).toBeTruthy();
  });

  it('should render featured article', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Featured');
  });

  it('should render avatar fallbacks for quick links', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const avatars = compiled.querySelectorAll('hlm-avatar');

    expect(avatars.length).toBeGreaterThan(0);
  });

  it('should have activeTab signal', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    const comp = fixture.componentInstance as any;

    expect(comp.activeTab()).toBe('discover');
  });

  it('should render weather info', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('São Paulo');
    expect(compiled.textContent).toContain('28°C');
  });
});
