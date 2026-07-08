import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {SessionService} from '../services/session.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);
    const token = sessionService.getToken();

    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        headers: req.headers.set('Authorization', token)
    });

    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            if ((err.status === 403 || err.status === 401) &&
                router.routerState.snapshot.url !== '/auth/login') {
                sessionService.logout();
            }
            return throwError(() => err);
        })
    );
};
