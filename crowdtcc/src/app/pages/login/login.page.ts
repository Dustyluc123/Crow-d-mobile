import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // >>> BOOLEAN, não signal
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  async onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const { email, password } = this.form.getRawValue();
    try {
      await signInWithEmailAndPassword(this.auth, email!, password!);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      this.showToast(err?.message || 'Falha ao entrar.');
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    if (this.loading) return;
    this.loading = true;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      this.showToast(err?.message || 'Falha ao entrar com Google.');
    } finally {
      this.loading = false;
    }
  }

  forgotPassword() {
    this.showToast('Em breve: recuperação de senha.');
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  private async showToast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, position: 'bottom' });
    await t.present();
  }
}
