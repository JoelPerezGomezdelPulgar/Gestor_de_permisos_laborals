import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Lobby } from './pages/lobby/lobby';
import { EmailRequest } from './pages/email-request/email-request';
import { Admin } from './pages/admin/admin';
import { UserBasic } from './pages/user-basic/user-basic';
import { Permisos } from './pages/permisos/permisos';
import { UserPeticio } from './pages/user-peticio/user-peticio';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { Register } from './pages/register/register';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

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
        path: 'register',
        component: Register
    },
    {
        path: '',
        component: Lobby,
        children: [
            {
                path: 'user',
                component: UserBasic,
                canActivate: [adminGuard]
            },
            {
                path: 'permisos',
                component: Permisos,
                canActivate: [adminGuard]
            },
            {
                path: 'admin',
                component: Admin,
                canActivate: [adminGuard]
            },
            {
                path: 'userPeticio',
                component: UserPeticio,
                canActivate: [authGuard]
            },
            {
                path: 'userDashboard',
                component: UserDashboard,
                canActivate: [authGuard]
            }
        ]
    }

];
