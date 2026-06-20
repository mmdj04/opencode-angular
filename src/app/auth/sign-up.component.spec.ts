import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render logo', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork');
  });

  it('should render heading', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Get started');
  });

  it('should render GitHub button', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Continue with GitHub');
  });

  it('should render email input', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('input[type="email"]');

    expect(input).toBeTruthy();
  });

  it('should render password input', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('input[type="password"]');

    expect(input).toBeTruthy();
  });

  it('should render sign up button', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Sign up');
  });

  it('should render password requirements', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Uppercase letter');
    expect(compiled.textContent).toContain('Lowercase letter');
    expect(compiled.textContent).toContain('Number');
    expect(compiled.textContent).toContain('8 characters or more');
  });

  it('should render link to sign in', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Have an account?');
    expect(compiled.textContent).toContain('Sign in');
  });

  it('should call onSubmit', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    fixture.componentInstance.onSubmit();
    expect(spy).toHaveBeenCalledWith('Sign up:', { email: '', password: '' });
    spy.mockRestore();
  });

  it('should call onGithub', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    fixture.componentInstance.onGithub();
    expect(spy).toHaveBeenCalledWith('Sign up with GitHub');
    spy.mockRestore();
  });

  it('should toggle showPassword', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    expect(fixture.componentInstance.showPassword()).toBe(false);
    fixture.componentInstance.showPassword.set(true);
    expect(fixture.componentInstance.showPassword()).toBe(true);
  });

  it('should render password toggle button', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const passwordGroup = compiled.querySelector('#password')?.closest('[data-slot="input-group"]');

    expect(passwordGroup).toBeTruthy();
  });

  it('should compute passwordRequirements with empty password', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    const reqs = fixture.componentInstance.passwordRequirements();

    expect(reqs.length).toBe(5);
    for (const req of reqs) {
      expect(req.met()).toBe(false);
    }
  });

  it('should compute passwordRequirements with strong password', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.componentInstance.password = 'StrongP@ss1';

    const reqs = fixture.componentInstance.passwordRequirements();

    expect(reqs[0]?.met()).toBe(true); // Uppercase
    expect(reqs[1]?.met()).toBe(true); // Lowercase
    expect(reqs[2]?.met()).toBe(true); // Number
    expect(reqs[3]?.met()).toBe(true); // Special char
    expect(reqs[4]?.met()).toBe(true); // 8+ chars
  });

  it('should compute passwordRequirements with partial password', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.componentInstance.password = 'abc';

    const reqs = fixture.componentInstance.passwordRequirements();

    expect(reqs[0]?.met()).toBe(false); // No uppercase
    expect(reqs[1]?.met()).toBe(true); // Lowercase
    expect(reqs[2]?.met()).toBe(false); // No number
    expect(reqs[3]?.met()).toBe(false); // No special char
    expect(reqs[4]?.met()).toBe(false); // < 8 chars
  });

  it('should render terms text', () => {
    const fixture = TestBed.createComponent(SignUpComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Terms of Service');
    expect(compiled.textContent).toContain('Privacy Policy');
  });
});
