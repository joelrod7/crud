import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from './token.service';

export const canActivateAuth: CanActivateFn = () => {
  const token = inject(TokenService);
  const router = inject(Router);
  if (token.hasToken()) return true;
  router.navigateByUrl('/auth');
  return false;
};
