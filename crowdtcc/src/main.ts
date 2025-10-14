// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter, CanActivateFn, Router } from '@angular/router'; // Adicione CanActivateFn e Router
import { provideIonicAngular } from '@ionic/angular/standalone';
import { inject } from '@angular/core'; // Adicione inject
import { firstValueFrom } from 'rxjs'; // Adicione firstValueFrom

import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, initializeAuth, indexedDBLocalPersistence } from '@angular/fire/auth';

import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AuthService } from './app/services/auth'; // Importe o AuthService aqui

// --- LÓGICA DAS GUARDAS DE ROTA ---
// Colocamos a lógica que estava em auth.guard.ts diretamente aqui

const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await firstValueFrom(authService.currentUser);

  if (user) {
    return true; // Usuário logado, pode acessar a rota
  }
  // Usuário não logado, redireciona para a página de login
  return router.parseUrl('/login');
};

const publicGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await firstValueFrom(authService.currentUser);

  if (user) {
    // Usuário já está logado, redireciona para a home
    return router.parseUrl('/home');
  }
  // Usuário não está logado, pode acessar a rota de login/registro
  return true;
};
// --- FIM DA LÓGICA DAS GUARDAS ---


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./app/pages/login/login.page').then(m => m.LoginPage),
    canActivate: [publicGuard] // Protege a rota de login
  },
  {
    path: 'register',
    loadComponent: () => import('./app/pages/register/register.page').then(m => m.RegisterPage),
    canActivate: [publicGuard] // Protege a rota de registro
  },
  {
    path: 'home',
    loadComponent: () => import('./app/home/home.page').then(m => m.HomePage),
    canActivate: [authGuard] // Protege a rota home
  },
  { path: '**', redirectTo: 'login' },
];

addIcons({ 'logo-google': logoGoogle });

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const app = getApp();
      return initializeAuth(app, { persistence: indexedDBLocalPersistence });
    }),
  ],
});