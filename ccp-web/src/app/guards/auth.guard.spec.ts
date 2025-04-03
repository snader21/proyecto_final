import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should be created', () => {
    expect(AuthGuard).toBeTruthy();
  });

  it('should allow access if user is authenticated', () => {
    localStorage.setItem('token', 'fake-token');
    const result = AuthGuard({} as any, { url: '/dashboard' } as any, routerSpy);
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if user is not authenticated', () => {
    localStorage.removeItem('token');
    const result = AuthGuard({} as any, { url: '/protected' } as any, routerSpy);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
