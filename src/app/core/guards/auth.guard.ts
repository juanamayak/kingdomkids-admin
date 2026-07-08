import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {SessionService} from '../services/session.service';

// TODO: Activar cuando se implemente autenticación completa en el backend
export const authGuard: CanActivateFn = (route, state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    if (sessionService.getToken()) {
        return true;
    }

    router.navigate(['auth/login']);
    return false;
};

