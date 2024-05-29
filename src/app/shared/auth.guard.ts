import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    console.log("GUARD: Utilisateur non connecté, redirection vers /login");
    authService.logOut();
    router.navigate(['/login']);
    return false;
  }
};
