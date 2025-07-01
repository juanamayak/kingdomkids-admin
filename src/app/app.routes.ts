import {Routes} from '@angular/router';
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'auth', loadChildren: () => import('./auth/auth.routes')
            },
            {path: '', pathMatch: 'full', redirectTo: 'auth/login'}
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        // canActivate: [AuthGuard],
        children: [
            {
                path: '', loadChildren: () => import('./pages/pages.routes')
            },
        ],
    },
    {path: '**', redirectTo: 'auth/login'} // TODO: Redirigir a PageNotFound
];
