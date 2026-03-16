import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Header } from './pages/header/header';
import { Employee } from './pages/employee/employee';
import { LeaveBalance } from './pages/leave-balance/leave-balance';
import { LeaveRequest } from './pages/leave-request/leave-request';
import { Lobby } from './pages/lobby/lobby';
import { EmailRequest } from './pages/email-request/email-request';

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
                path: 'employee',
                component: Employee
            },
            {
                path: 'balance',
                component: LeaveBalance
            },
            {
                path: 'leave-request',
                component: LeaveRequest
            }
        ]
    }

];
