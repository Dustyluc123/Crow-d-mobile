import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { PostService } from '../services/post.service';
import { Post } from '../services/post.interface';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth'; // <--- ERRO PROVÁVEL ESTAVA AQUI

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private postService = inject(PostService);

  posts: Post[] = [];
  lastVisible: any = null;
  activeFeedType: string = 'main';
  userProfile: any;
  private userSubscription: Subscription | null = null; // Inicie como null
  isLoading = false;
  infiniteScrollDisabled = false; // Para desabilitar a rolagem infinita

  ngOnInit() {
    // A subscrição é guardada
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.loadInitialData(user);
      } else {
        // Limpa os dados se o usuário deslogar
        this.posts = [];
        this.userProfile = null;
        this.lastVisible = null;
      }
    });
  }

  ngOnDestroy() {
    // Cancela a subscrição ao sair da página
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async loadInitialData(user: User) {
    // Só carrega se não tiver um perfil (evita recarregar ao voltar para a home)
    if (!this.userProfile) {
      this.userProfile = await this.postService.getUserProfile(user.uid);
      this.loadPosts(undefined, true);
    }
  }

  async loadPosts(event?: InfiniteScrollCustomEvent, isInitialLoad = false) {
    if (isInitialLoad) {
      this.posts = [];
      this.lastVisible = null;
      this.infiniteScrollDisabled = false; // Reseta a rolagem
    }

    this.isLoading = true;

    const snapshot = await this.postService.getPosts(this.lastVisible, this.activeFeedType, this.userProfile);

    this.isLoading = false;

    if (snapshot.docs.length > 0) {
      this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
      snapshot.forEach(doc => {
        this.posts.push({ id: doc.id, ...doc.data() } as Post);
      });
    }

    if (event) {
      event.target.complete();
      if (snapshot.docs.length < 10) {
        // Se vieram menos de 10, não há mais posts
        event.target.disabled = true;
        this.infiniteScrollDisabled = true;
      }
    }
  }

  // Acionado pelo (ionChange) do ion-segment
  changeFeed(event: any) {
    this.activeFeedType = event.detail.value;
    this.loadPosts(undefined, true); // Força um recarregamento inicial
  }

  logout() {
    this.authService.logout();
  }
}
