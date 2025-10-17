import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';

// Adicionado: Importações necessárias para configurar o módulo de testes
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { NgZone } from '@angular/core';

// Mocks (simulações) para as dependências
const mockAuth = { onAuthStateChanged: () => {} };
const mockRouter = { navigateByUrl: () => {} };
const mockToastController = { create: () => ({ present: () => {} }) };
const mockPlatform = { is: (platform: string) => platform === 'web' }; // Mock para simular ambiente web
const mockNgZone = { run: (fn: Function) => fn() }; // Mock para executar funções imediatamente

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // Fornecendo as dependências com os Mocks
        { provide: Auth, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
        { provide: ToastController, useValue: mockToastController },
        { provide: Platform, useValue: mockPlatform },
        { provide: NgZone, useValue: mockNgZone },
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Você pode adicionar mais testes aqui, se necessário
});
