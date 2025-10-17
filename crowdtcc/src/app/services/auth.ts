// src/app/services/auth.ts

import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
  signInWithCredential,
  signInWithPopup,
} from '@angular/fire/auth';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

// Adicionado: Interface para forçar o TypeScript a reconhecer o retorno do plugin nativo
interface SocialLoginResponse {
  accessToken?: string;
  idToken?: string;
  token?: string;
  user?: any;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser = new BehaviorSubject<User | null>(null);

  // Injeção de dependências via 'inject'
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private toastCtrl: ToastController = inject(ToastController);
  private ngZone: NgZone = inject(NgZone);
  private platform: Platform = inject(Platform);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.next(user);
    });
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        this.ngZone.run(() => this.router.navigateByUrl('/home', { replaceUrl: true }));
      }
    } catch (err: any) {
      this.showToast(err?.message || 'Falha ao entrar.');
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      if (!this.platform.is('capacitor')) {
        // FLUXO WEB/PWA: Usa pop-up e navega DIRETAMENTE após a autenticação
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(this.auth, provider);

        if (userCredential.user) {
          this.ngZone.run(() => this.router.navigateByUrl('/home', { replaceUrl: true }));
        }

      } else {
        // FLUXO NATIVO (Capacitor/Mobile):
        const SocialLoginPlugin = (window as any).SocialLogin;

        if (!SocialLoginPlugin || !SocialLoginPlugin.login) {
            throw new Error('Plugin SocialLogin não está disponível no ambiente Capacitor.');
        }

        // 1. Obter token nativo do Google
        const response: SocialLoginResponse = await SocialLoginPlugin.login({ provider: 'google' });
        const idToken = response.idToken || response.token;

        if (!idToken) {
            throw new Error('Token de autenticação do Google não encontrado.');
        }

        // 2. Autenticar no Firebase com o token nativo e navega APÓS O SUCESSO
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(this.auth, credential);

        if (userCredential.user) {
            this.ngZone.run(() => this.router.navigateByUrl('/home', { replaceUrl: true }));
        }
      }

      // REMOVIDO: A navegação final estava aqui (Linha 80), mas foi movida para dentro
      // dos blocos if/else para garantir que só seja executada após o sucesso.

    } catch (err: any) {
      // Se houver qualquer erro (login cancelado, token não encontrado, etc.), o toast será exibido.
      this.showToast(err?.message || 'Falha ao entrar com Google. Verifique o pop-up e a configuração nativa.');
    }
  }

  // MÉTODO DE LOGOUT
  async logout(): Promise<void> {
    try {
        if (this.platform.is('capacitor')) {
            const SocialLoginPlugin = (window as any).SocialLogin;
            if (SocialLoginPlugin && SocialLoginPlugin.signOut) {
                 await SocialLoginPlugin.signOut({ provider: 'google' });
            }
        }
      await signOut(this.auth);
      this.ngZone.run(() => this.router.navigateByUrl('/login', { replaceUrl: true }));
    } catch (err: any) {
      this.showToast('Erro ao sair.');
    }
  }

  private async showToast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
    });
    await t.present();
  }
}
