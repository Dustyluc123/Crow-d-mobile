// src/app/services/auth.ts

import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  User,
  signOut, // Importe o signOut
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
      await signInWithRedirect(this.auth, provider);
    } catch (err: any) {
      this.showToast(err?.message || 'Falha ao iniciar login com Google.');
    }
  }

  // NOVO MÉTODO DE LOGOUT
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