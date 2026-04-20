import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const rol = localStorage.getItem('rol');

    if (rol === 'admin') {
        return true;
    }

    if (rol) {
        router.navigate(['/userDashboard']);
    } else {
        router.navigate(['/login']);
    }

    return false;
};
