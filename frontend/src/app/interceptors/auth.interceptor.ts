import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MasterService } from '../service/master-service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const masterSrv = inject(MasterService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si recibimos un 401 y no es una petición de login o de refresco
      if (error.status === 401 && !req.url.includes('refresh-token') && !req.url.includes('login')) {
        return masterSrv.renewToken().pipe(
          switchMap(() => {
            // Si el refresco fue bien, reintentamos la petición original
            return next(req);
          }),
          catchError((err) => {
            // Si el refresco falla (el refresh token también expiró), redirigimos al login
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
