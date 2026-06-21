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

  it('should render tabs', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Discover');
    expect(compiled.textContent).toContain('News');
  });

  it('should render footer', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('© 2026 Agentwork');
    expect(compiled.textContent).toContain('Privacy');
    expect(compiled.textContent).toContain('Terms');
  });

  it('should have activeTab signal', () => {
    const fixture = TestBed.createComponent(AgentworkNewsComponent);

    const comp = fixture.componentInstance as any;

    expect(comp.activeTab()).toBe('discover');
  });
});
