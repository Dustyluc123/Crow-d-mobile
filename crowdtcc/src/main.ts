import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons'; // 👈 importa o ícone

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./app/pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./app/pages/register/register.page').then(m => m.RegisterPage) },
  { path: 'home', loadComponent: () => import('./app/home/home.page').then(m => m.HomePage) },
  { path: '**', redirectTo: 'login' },
];

// 👇 registra o ícone antes do bootstrap
addIcons({ 'logo-google': logoGoogle });

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
});
