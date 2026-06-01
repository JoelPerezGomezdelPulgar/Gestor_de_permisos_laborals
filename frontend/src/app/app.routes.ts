import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Lobby } from './pages/lobby/lobby';
import { EmailRequest } from './pages/email-request/email-request';
import { Dashboard } from './pages/dashboard/dashboard';
import { UserBasic } from './pages/user-basic/user-basic';
import { Permisos } from './pages/permisos/permisos';
import { UserPeticio } from './pages/user-peticio/user-peticio';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';

import { Home } from './pages/home/home';

export const routes: Routes = [

    {
        path: '',
        component: Home,
        pathMatch: 'full'
    },
    {
        path: 'lobby',
        redirectTo: '',
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
                component: UserBasic,
            },
            {
                path: 'permisos',
                component: Permisos,
            },
            {
                path: 'admin',
                component: Dashboard,
            },
            {
                path: 'userPeticio',
                component: UserPeticio,
            },
            {
                path: 'userDashboard',
                component: Dashboard,
            }
        ]
    }

];
