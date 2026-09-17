import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';

import { PublicNewsArticle } from '../../../../../../core/models';
import { PublicNewsService } from '../../../../../../core/services/public-news.service';
import { IconComponent } from '../../../../../../shared/ui';

const EXCERPT_LENGTH = 140;

/** Card de noticia — imagen, título, fecha, extracto truncado. Sin flip (es contenido de lectura, no un producto). Click abre el detalle completo. */
@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [DatePipe, IconComponent],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCardComponent {
  @Input({ required: true }) article!: PublicNewsArticle;

  @Output() opened = new EventEmitter<void>();

  private readonly publicNewsService = inject(PublicNewsService);

  readonly imageUrl = computed(() => (this.article.hasImage ? this.publicNewsService.getImageUrl(this.article.id) : null));

  readonly excerpt = computed(() => {
    const description = this.article.description;
    if (description.length <= EXCERPT_LENGTH) {
      return description;
    }
    return `${description.slice(0, EXCERPT_LENGTH).trimEnd()}…`;
  });

  open(): void {
    this.opened.emit();
  }
}
