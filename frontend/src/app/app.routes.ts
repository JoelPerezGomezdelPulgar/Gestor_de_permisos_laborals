import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Lobby } from './pages/lobby/lobby';
import { EmailRequest } from './pages/email-request/email-request';
import { Admin } from './pages/admin/admin';
import { UserBasic } from './pages/user-basic/user-basic';
import { Permisos } from './pages/permisos/permisos';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'lobby',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'email-request',
        component: EmailRequest
    },
    {
        path: '',
        component: Lobby,
        children: [
            {
                path: 'user',
                component: UserBasic
            },
            {
                path: 'permisos',
                component: Permisos
            },
            {
                path: 'admin',
                component: Admin
            }
        ]
    }

];
