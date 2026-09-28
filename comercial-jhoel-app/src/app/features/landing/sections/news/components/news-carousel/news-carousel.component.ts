import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PublicNewsArticle } from '../../../../../../core/models';
import { LandingCarouselComponent } from '../../../shared/landing-carousel/landing-carousel.component';
import { NewsCardComponent } from '../news-card/news-card.component';

/**
 * Carrusel de Noticias — sin flip, cada card abre el modal de detalle. La
 * mecánica vive en `LandingCarouselComponent`.
 */
@Component({
  selector: 'app-news-carousel',
  standalone: true,
  imports: [LandingCarouselComponent, NewsCardComponent],
  templateUrl: './news-carousel.component.html',
  styleUrl: './news-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCarouselComponent {
  @Input({ required: true }) articles: PublicNewsArticle[] = [];

  @Output() opened = new EventEmitter<PublicNewsArticle>();

  readonly articleLabel = (article: PublicNewsArticle): string => article.title;

  onOpen(article: PublicNewsArticle): void {
    this.opened.emit(article);
  }
}
