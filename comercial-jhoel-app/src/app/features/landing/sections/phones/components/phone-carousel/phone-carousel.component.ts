import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CatalogRequestType, PublicCatalogPhone } from '../../../../../../core/models';
import { LandingCarouselComponent } from '../../../shared/landing-carousel/landing-carousel.component';
import { PhoneCardComponent } from '../phone-card/phone-card.component';

export interface PhoneInterestEvent {
  phone: PublicCatalogPhone;
  requestType: CatalogRequestType;
}

/**
 * Carrusel de Teléfonos — delega toda la mecánica (scroll full-width,
 * swipe/arrastre, flechas, puntos, autoplay con pausa) en el
 * `LandingCarouselComponent` compartido por toda la landing; aquí solo se
 * decide qué card se pinta por slide y se reenvían sus eventos.
 */
@Component({
  selector: 'app-phone-carousel',
  standalone: true,
  imports: [LandingCarouselComponent, PhoneCardComponent],
  templateUrl: './phone-carousel.component.html',
  styleUrl: './phone-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneCarouselComponent {
  @Input({ required: true }) phones: PublicCatalogPhone[] = [];

  @Output() requestInterest = new EventEmitter<PhoneInterestEvent>();
  @Output() imageZoom = new EventEmitter<{ url: string; alt: string }>();

  readonly phoneLabel = (phone: PublicCatalogPhone): string => `${phone.brand} ${phone.model}`;

  onInterest(phone: PublicCatalogPhone, requestType: CatalogRequestType): void {
    this.requestInterest.emit({ phone, requestType });
  }

  onImageZoom(event: { url: string; alt: string }): void {
    this.imageZoom.emit(event);
  }
}
