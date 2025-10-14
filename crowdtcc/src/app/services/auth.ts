// src/app/services/auth.ts

import { Injectable, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect, // Importe este
  getRedirectResult,  // E este
  UserCredential
} from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private toastCtrl: ToastController = inject(ToastController);
  private ngZone: NgZone = inject(NgZone); // Importante para navegação fora do Angular

  constructor() {
    // Verifica o resultado do redirecionamento quando o serviço é inicializado
    this.handleRedirectResult();
  }

  private async handleRedirectResult(): Promise<void> {
    try {
      const result = await getRedirectResult(this.auth);
      if (result && result.user) {
        // Usuário logado com sucesso via redirecionamento.
        // Usamos NgZone para garantir que a navegação aconteça dentro da zona do Angular
        this.ngZone.run(() => {
          this.router.navigateByUrl('/home', { replaceUrl: true });
        });
      }
    } catch (err: any) {
      // Lida com erros do redirecionamento.
      // Isso pode acontecer se o usuário fechar a página de login.
      console.error('Erro no redirecionamento do Google:', err);
      this.showToast(err?.message || 'Falha ao autenticar com Google.');
    }
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    } catch (err: any) {
      this.showToast(err?.message || 'Falha ao entrar.');
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      // Use signInWithRedirect em vez de signInWithPopup
      await signInWithRedirect(this.auth, provider);
    } catch (err: any) {
      this.showToast(err?.message || 'Falha ao iniciar login com Google.');
    }
  }

  private async showToast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 2500, position: 'bottom' });
    await t.present();
  }
}