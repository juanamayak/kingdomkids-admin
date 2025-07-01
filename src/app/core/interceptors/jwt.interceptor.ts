import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {catchError, tap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);
    const token = sessionService.getToken();

    if (!token) {
        return next(req);
    }

    const headers = req.clone({
        headers: req.headers.set('Authorization', `${token}`),
    });

    return next(headers).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 403 && router.routerState.snapshot.url !== '/login') {
                sessionService.logout();
            } else if (err.status === 401) {
                sessionService.logout();
            }
            return throwError(err);
        })
    );
};
