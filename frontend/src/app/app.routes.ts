import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Header } from './pages/header/header';
import { LeaveBalance } from './pages/leave-balance/leave-balance';
import { LeaveRequest } from './pages/leave-request/leave-request';
import { Lobby } from './pages/lobby/lobby';
import { EmailRequest } from './pages/email-request/email-request';
import { Admin } from './pages/admin/admin';
import { UserBasic } from './pages/user-basic/user-basic';

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
                path: 'balance',
                component: LeaveBalance
            },
            {
                path: 'admin',
                component: Admin
            }
        ]
    }

];
