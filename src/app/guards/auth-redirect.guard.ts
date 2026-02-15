import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const AuthRedirectGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUser();

  if (user) {
    user.role === 'admin'
      ? router.navigate(['/admin'])
      : router.navigate(['/home']);

    return false;
  }

  return true;
};


