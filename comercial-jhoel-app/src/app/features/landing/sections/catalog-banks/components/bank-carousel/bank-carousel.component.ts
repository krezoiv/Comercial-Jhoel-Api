import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PublicCatalogBank } from '../../../../../../core/models';
import { LandingCarouselComponent } from '../../../shared/landing-carousel/landing-carousel.component';
import { BankCardComponent } from '../bank-card/bank-card.component';

/**
 * Carrusel de "Bancos con los que trabajamos" — solo información pública
 * de cada entidad (imagen, nombre, descripción). La mecánica vive en
 * `LandingCarouselComponent`.
 */
@Component({
  selector: 'app-bank-carousel',
  standalone: true,
  imports: [LandingCarouselComponent, BankCardComponent],
  templateUrl: './bank-carousel.component.html',
  styleUrl: './bank-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankCarouselComponent {
  @Input({ required: true }) banks: PublicCatalogBank[] = [];

  @Output() imageZoom = new EventEmitter<{ url: string; alt: string }>();

  readonly bankLabel = (bank: PublicCatalogBank): string => bank.name;

  onImageZoom(event: { url: string; alt: string }): void {
    this.imageZoom.emit(event);
  }
}
