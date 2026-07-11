import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {ChangePasswordComponent} from './pages/change-password/change-password.component';

export default [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'login/password/first/:first/:uuid',
        component: ChangePasswordComponent
    },
    {
        path: 'login/password/expired/:expired/:uuid',
        component: ChangePasswordComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
] as Routes;

