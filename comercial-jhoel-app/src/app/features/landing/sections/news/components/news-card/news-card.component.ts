import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';

import { PublicNewsArticle } from '../../../../../../core/models';
import { PublicNewsService } from '../../../../../../core/services/public-news.service';
import { IconComponent, LikeButtonComponent } from '../../../../../../shared/ui';

const EXCERPT_LENGTH = 140;

/**
 * Card de noticia — imagen, título, fecha, extracto truncado. Sin flip (es
 * contenido de lectura, no un producto). Click abre el detalle completo.
 * El contenedor raíz es un `<div role="button">` (no un `<button>`) para
 * poder alojar el botón de "me gusta" real sin anidar un botón dentro de
 * otro elemento con rol de botón — mismo criterio ya documentado en
 * `PhoneCardComponent`.
 */
@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [DatePipe, IconComponent, LikeButtonComponent],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCardComponent implements OnInit {
  @Input({ required: true }) article!: PublicNewsArticle;

  @Output() opened = new EventEmitter<void>();

  private readonly publicNewsService = inject(PublicNewsService);

  readonly liked = signal(false);
  readonly likesCount = signal(0);
  readonly likeBusy = signal(false);

  readonly imageUrl = computed(() => (this.article.hasImage ? this.publicNewsService.getImageUrl(this.article.id) : null));

  readonly excerpt = computed(() => {
    const description = this.article.description;
    if (description.length <= EXCERPT_LENGTH) {
      return description;
    }
    return `${description.slice(0, EXCERPT_LENGTH).trimEnd()}…`;
  });

  ngOnInit(): void {
    // El estado del like siempre viene del backend (fuente de verdad en PostgreSQL) — nunca de localStorage.
    this.liked.set(this.article.liked);
    this.likesCount.set(this.article.likesCount);
  }

  open(): void {
    this.opened.emit();
  }

  onKeydownOpen(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.open();
    }
  }

  /** Optimista: refleja el nuevo estado de inmediato y lo revierte si la llamada falla. El backend es siempre la fuente de verdad final del contador. */
  toggleLike(): void {
    if (this.likeBusy()) {
      return;
    }
    const next = !this.liked();
    this.liked.set(next);
    this.likesCount.update((count) => Math.max(0, count + (next ? 1 : -1)));
    this.likeBusy.set(true);

    const request$ = next
      ? this.publicNewsService.likeArticle(this.article.id)
      : this.publicNewsService.unlikeArticle(this.article.id);

    request$.subscribe({
      next: (result) => {
        this.likesCount.set(result.likesCount);
        this.liked.set(result.liked);
        this.likeBusy.set(false);
      },
      error: () => {
        this.liked.set(!next);
        this.likesCount.update((count) => Math.max(0, count + (next ? -1 : 1)));
        this.likeBusy.set(false);
      },
    });
  }
}
