import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';

import { PublicNewsArticle } from '../../../../../../core/models';
import { PublicNewsService } from '../../../../../../core/services/public-news.service';
import { ButtonComponent, IconComponent } from '../../../../../../shared/ui';

/** Detalle completo de una noticia — imagen completa, título, fecha, descripción completa. Sin flip, sin WhatsApp, sin Krediya. */
@Component({
  selector: 'app-news-detail-modal',
  standalone: true,
  imports: [DatePipe, ButtonComponent, IconComponent],
  templateUrl: './news-detail-modal.component.html',
  styleUrl: './news-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailModalComponent {
  @Input() article: PublicNewsArticle | null = null;

  @Output() closed = new EventEmitter<void>();

  private readonly publicNewsService = inject(PublicNewsService);

  readonly imageUrl = computed(() =>
    this.article?.hasImage ? this.publicNewsService.getImageUrl(this.article.id) : null,
  );

  get open(): boolean {
    return this.article !== null;
  }

  close(): void {
    this.closed.emit();
  }
}
