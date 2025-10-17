
// src/app/services/auth.ts

import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult, // Importado para lidar com o redirecionamento
  onAuthStateChanged,
  User,
  signOut,
} from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject para expor o estado do usuário de forma reativa
  public currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: Auth,
    private router: Router,
    private toastCtrl: ToastController,
    private ngZone: NgZone
  ) {
    onAuthStateChanged(this.auth, (user) => {
      // Atualiza o nosso BehaviorSubject com o estado atual do usuário
      this.currentUser.next(user);
    });

    // Chamada para verificar se o usuário voltou de um redirecionamento do Google
    this.checkRedirectResult();
  }

  // MÉTODO CORRIGIDO: Para processar o resultado do redirecionamento
  private async checkRedirectResult(): Promise<void> {
    try {
      // Tenta completar o fluxo de login iniciado por signInWithRedirect.
      // É esperado que lance um erro (auth/argument-error) se não houver um redirecionamento pendente,
      // mas isso é tratado pelo bloco catch.
      const result = await getRedirectResult(this.auth);

      if (result && result.user) {
        // Redireciona para home se o login por redirecionamento for bem-sucedido
        this.ngZone.run(() => this.router.navigateByUrl('/home', { replaceUrl: true }));
      }
    } catch (error: any) {
      // Este bloco captura o erro 'auth/argument-error' esperado quando não há redirect pendente,
      // e também outros erros reais (como o usuário cancelar o login no Google).
      if (error.code !== 'auth/argument-error') {
        this.showToast(error.message || 'Falha ao completar login com Google após redirecionamento.');
      }
    }
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
      const provider = new GoogleAuthProvider();
      // O signInWithRedirect inicia o processo e nos redireciona
      await signInWithRedirect(this.auth, provider);
      // O retorno do redirecionamento será tratado em checkRedirectResult()
    } catch (err: any) {
      this.showToast(err?.message || 'Falha ao iniciar login com Google.');
    }
  }

  // MÉTODO DE LOGOUT
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // Redireciona para o login após o logout bem-sucedido
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
