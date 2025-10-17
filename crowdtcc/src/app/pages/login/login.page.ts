import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Importe o serviço

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService); // Injete o serviço
  private router: Router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loading: boolean = false;

  async onSubmit() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    const { email, password } = this.form.getRawValue();
    // Verifica se email e password não são nulos antes de passar para o serviço
    if (email && password) {
      await this.authService.loginWithEmail(email, password);
    }
    this.loading = false;
  }

  async loginWithGoogle() {
    if (this.loading) return;

    this.loading = true;
    await this.authService.loginWithGoogle();
    this.loading = false;
  }

  forgotPassword() {
    // Você pode adicionar a lógica de "Esqueci a senha" aqui se desejar,
    // talvez chamando um método no seu AuthService.
    console.log('Botão "Esqueceu a senha?" clicado.');
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
