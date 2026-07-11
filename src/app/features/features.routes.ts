import {Routes} from '@angular/router';

export default [
    {
        path: 'kids',
        children: [
            { path: '', loadChildren: () => import('./kids/kids.routes') }
        ]
    },
] as Routes;

