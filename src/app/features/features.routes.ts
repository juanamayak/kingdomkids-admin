import {Routes} from '@angular/router';

export default [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'kids',
        children: [
            { path: '', loadChildren: () => import('./kids/kids.routes') }
        ]
    },
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
] as Routes;

