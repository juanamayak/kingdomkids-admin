import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {definePreset} from "@primeng/themes";
import {jwtInterceptor} from "./core/interceptors/jwt.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes, withComponentInputBinding()),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: definePreset(Aura, {
                    semantic: {
                        primary: {
                            50: '{sky.50}',
                            100: '{sky.100}',
                            200: '{sky.200}',
                            300: '{sky.300}',
                            400: '{sky.400}',
                            500: '{sky.500}',
                            600: '{sky.600}',
                            700: '{sky.700}',
                            800: '{sky.800}',
                            900: '{sky.900}',
                            950: '{sky.950}'
                        },
                        colorScheme: {
                            light: {
                                primary: {
                                    color: '{sky.600}',
                                    inverseColor: '#ffffff',
                                    hoverColor: '{sky.700}',
                                    activeColor: '{sky.700}'
                                }
                            }
                        }
                    }
                }),
                options: {
                    prefix: 'p',
                    darkModeSelector: 'light',
                    cssLayer: false
                }
            }
        }),
        provideHttpClient(withInterceptors([jwtInterceptor])),
    ]
};
