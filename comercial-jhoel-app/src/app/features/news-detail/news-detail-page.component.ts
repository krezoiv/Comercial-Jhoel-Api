import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { PublicNewsArticle } from '../../core/models';
import { PublicNewsService } from '../../core/services/public-news.service';
import { BadgeComponent, ButtonComponent, IconComponent, SectionComponent } from '../../shared/ui';

/**
 * URL pública real de una noticia (`/noticias/:slug`) — punto 17/18 del
 * pedido. Antes de esto, una noticia solo existía como modal en memoria
 * dentro de `/`, sin URL propia — este es el destino real del enlace que
 * se manda en el mensaje de WhatsApp, funcional desde WhatsApp, navegador,
 * móvil, desktop, refresh y acceso directo.
 */
@Component({
  selector: 'app-news-detail-page',
  standalone: true,
  imports: [DatePipe, RouterLink, SectionComponent, BadgeComponent, ButtonComponent, IconComponent],
  templateUrl: './news-detail-page.component.html',
  styleUrl: './news-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicNewsService = inject(PublicNewsService);

  readonly article = signal<PublicNewsArticle | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  readonly imageUrl = computed(() => {
    const article = this.article();
    return article?.hasImage ? this.publicNewsService.getImageUrl(article.id) : null;
  });

  constructor() {
    this.route.paramMap
      .pipe(switchMap((params) => this.publicNewsService.getArticleBySlug(params.get('slug') ?? '')))
      .subscribe({
        next: (article) => {
          this.article.set(article);
          this.loading.set(false);
        },
        error: (_error: HttpErrorResponse) => {
          this.notFound.set(true);
          this.loading.set(false);
        },
      });
  }
}
