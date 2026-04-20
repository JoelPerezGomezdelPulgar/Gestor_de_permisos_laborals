import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const role = localStorage.getItem('rol');

    if (role) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};
