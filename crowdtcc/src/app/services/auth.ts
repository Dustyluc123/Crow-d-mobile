// src/app/services/auth.ts

import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
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
      const userCredential: UserCredential = await signInWithPopup(this.auth, provider);
      if (userCredential.user) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    } catch (err: any) {
      this.showToast(err?.message || 'Falha ao entrar com Google.');
    }
  }

  private async showToast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 2500, position: 'bottom' });
    await t.present();
  }
}