import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';
import {KkTheme} from './core/constants/theme-presets/kk-theme';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {jwtInterceptor} from './core/interceptors/jwt.interceptor';
import {AlertsService} from './core/services/alerts.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: KkTheme,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'light',
                    cssLayer: false
                }
            }
        }),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        AlertsService,
        ConfirmationService,
        MessageService,
        DialogService
    ]
};
