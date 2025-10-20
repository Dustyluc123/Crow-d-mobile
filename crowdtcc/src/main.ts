// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter, CanActivateFn, Router } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, initializeAuth, indexedDBLocalPersistence } from '@angular/fire/auth';

// ADICIONADO: Importações do Firestore
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AuthService } from './app/services/auth';

// --- LÓGICA DAS GUARDAS DE ROTA ---
// (Código omitido por ser grande, mas inalterado)
const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await firstValueFrom(authService.currentUser);

  if (user) {
    return true;
  }
  return router.parseUrl('/login');
};

const publicGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await firstValueFrom(authService.currentUser);

  if (user) {
    return router.parseUrl('/home');
  }
  return true;
};
// --- FIM DA LÓGICA DAS GUARDAS ---


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./app/pages/login/login.page').then(m => m.LoginPage),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./app/pages/register/register.page').then(m => m.RegisterPage),
    canActivate: [publicGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./app/home/home.page').then(m => m.HomePage),
    canActivate: [authGuard]
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
    // ADICIONADO: Provedor do Firestore
    provideFirestore(() => getFirestore()),
  ],
});
