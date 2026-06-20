import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render logo', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Agentwork');
  });

  it('should render heading', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Forgot your password?');
  });

  it('should render email input', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('input[type="email"]');

    expect(input).toBeTruthy();
  });

  it('should render send reset code button', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Send reset code');
  });

  it('should render link to sign in', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Already have an account?');
    expect(compiled.textContent).toContain('Sign In');
  });

  it('should call onSubmit', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    fixture.componentInstance.onSubmit();
    expect(spy).toHaveBeenCalledWith('Forgot password:', { email: '' });
    spy.mockRestore();
  });

  it('should render email icon', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const icons = compiled.querySelectorAll('ng-icon');

    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render sign up link', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain("Don't have an account?");
    expect(compiled.textContent).toContain('Sign up');
  });
});
