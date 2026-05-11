import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { MasterService } from '../service/master-service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const masterSrv = inject(MasterService);

    return masterSrv.getMe().pipe(
        map(res => {
            if (res) return true;
            router.navigate(['/login']);
            return false;
        }),
        catchError(() => {
            router.navigate(['/login']);
            return of(false);
        })
    );
};
