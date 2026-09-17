import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PublicNewsArticle } from '../../../../core/models';
import { PublicNewsService } from '../../../../core/services/public-news.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { NewsDetailModalComponent } from './components/news-detail-modal/news-detail-modal.component';

/**
 * Sección "NOTICIAS" de la landing pública — contenido editorial, NO un
 * producto (sin precio, sin WhatsApp, sin Krediya, sin flip). Cada card
 * abre un modal de detalle al hacer click. Si no hay noticias activas, la
 * sección no se renderiza.
 */
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [SectionComponent, SectionHeadingComponent, RevealOnScrollDirective, NewsCardComponent, NewsDetailModalComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  private readonly publicNewsService = inject(PublicNewsService);

  readonly articles = signal<PublicNewsArticle[]>([]);
  readonly loading = signal(true);

  readonly selectedArticle = signal<PublicNewsArticle | null>(null);

  constructor() {
    this.publicNewsService.getPublishedArticles().subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.loading.set(false);
      },
      error: (_error: HttpErrorResponse) => {
        this.loading.set(false);
      },
    });
  }

  openDetail(article: PublicNewsArticle): void {
    this.selectedArticle.set(article);
  }

  closeDetail(): void {
    this.selectedArticle.set(null);
  }
}
