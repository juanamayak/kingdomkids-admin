import {Routes} from '@angular/router';
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'auth', loadChildren: () => import('./features/auth/auth.routes')
            },
            { path: '', pathMatch: 'full', redirectTo: 'auth/login' }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '', loadChildren: () => import('./features/features.routes')
            },
        ],
    },
    { path: '**', redirectTo: 'auth/login' } // TODO: Redirigir a PageNotFound
];
