// src/app/guards/user.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const UserGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUser();

  if (user?.role === 'user') return true;

  router.navigate(['/login']);
  return false;
};


