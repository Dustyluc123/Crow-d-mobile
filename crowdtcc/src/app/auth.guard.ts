// src/app/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth';
import { firstValueFrom } from 'rxjs';

// Guarda para proteger rotas que exigem login (ex: /home)
export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = await firstValueFrom(authService.currentUser);

    if (user) {
        return true; // Usuário logado, pode acessar a rota
    } else {
        // Usuário não logado, redireciona para a página de login
        return router.parseUrl('/login');
    }
};

// Guarda para páginas públicas (ex: /login) que não devem ser vistas por usuários logados
export const publicGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = await firstValueFrom(authService.currentUser);

    if (user) {
        // Usuário já está logado, redireciona para a home
        return router.parseUrl('/home');
    } else {
        // Usuário não está logado, pode acessar a rota de login/registro
        return true;
    }
};