import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render logo', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork');
  });

  it('should render welcome heading', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Welcome back');
  });

  it('should render GitHub button', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Continue with GitHub');
  });

  it('should render SSO button', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Continue with SSO');
  });

  it('should render email input', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('input[type="email"]');

    expect(input).toBeTruthy();
  });

  it('should render password input', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('input[type="password"]');

    expect(input).toBeTruthy();
  });

  it('should render sign in button', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Sign in');
  });

  it('should render link to sign up', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain("Don't have an account?");
    expect(compiled.textContent).toContain('Sign up');
  });

  it('should render forgot password link', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Forgot password?');
  });

  it('should call onSubmit', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    fixture.componentInstance.onSubmit();
    expect(spy).toHaveBeenCalledWith('Sign in:', { email: '', password: '' });
    spy.mockRestore();
  });

  it('should call onGithub', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    fixture.componentInstance.onGithub();
    expect(spy).toHaveBeenCalledWith('Sign in with GitHub');
    spy.mockRestore();
  });

  it('should call onSSO', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    fixture.componentInstance.onSSO();
    expect(spy).toHaveBeenCalledWith('Sign in with SSO');
    spy.mockRestore();
  });

  it('should toggle showPassword', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    expect(fixture.componentInstance.showPassword()).toBe(false);
    fixture.componentInstance.showPassword.set(true);
    expect(fixture.componentInstance.showPassword()).toBe(true);
  });

  it('should render password toggle button', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const passwordGroup = compiled.querySelector('#password')?.closest('[data-slot="input-group"]');

    expect(passwordGroup).toBeTruthy();
  });

  it('should render terms text', () => {
    const fixture = TestBed.createComponent(SignInComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Terms of Service');
    expect(compiled.textContent).toContain('Privacy Policy');
  });
});
