import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { CreateUser } from './pages/create-user/create-user';
import { authGuard } from './guards/auth-guard';
import { managerGuard } from './guards/role-guard';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: Login
    },

    {
        path: 'signup',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },

    {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard]
    },

    {
        path: 'create-user',
        component: CreateUser,
        canActivate: [authGuard, managerGuard]
    }

];
