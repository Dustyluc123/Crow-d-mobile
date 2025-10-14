// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, initializeAuth, indexedDBLocalPersistence } from '@angular/fire/auth';

import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { authGuard, publicGuard } from './app/auth.guard'; // Importe as guardas

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