import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private toast = inject(ToastController);

  loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.loading.set(true);
    try {
      await signInWithEmailAndPassword(this.auth, email!, password!);
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      this.showError(this.translateAuthError(err?.code));
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithGoogle() {
    this.loading.set(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      this.showError(this.translateAuthError(err?.code));
    } finally {
      this.loading.set(false);
    }
  }

  async forgotPassword() {
    const email = this.form.controls.email.value;
    if (!email) {
      this.showError('Informe seu e-mail para recuperar a senha.');
      return;
    }
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.showOk('Enviamos um e-mail com instruções.');
    } catch (err: any) {
      this.showError(this.translateAuthError(err?.code));
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private async showError(message: string) {
    const t = await this.toast.create({ message, duration: 2500, color: 'danger' });
    await t.present();
  }

  private async showOk(message: string) {
    const t = await this.toast.create({ message, duration: 2000, color: 'success' });
    await t.present();
  }

  private translateAuthError(code?: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password': return 'E-mail ou senha inválidos.';
      case 'auth/user-not-found': return 'Usuário não encontrado.';
      case 'auth/popup-closed-by-user': return 'Login cancelado.';
      default: return 'Não foi possível entrar. Tente novamente.';
    }
  }
}
