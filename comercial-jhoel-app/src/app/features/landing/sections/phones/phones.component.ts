import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { CatalogRequestType, PublicCatalogPhone } from '../../../../core/models';
import { PublicCatalogService } from '../../../../core/services/public-catalog.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { PhoneCarouselComponent, PhoneInterestEvent } from './components/phone-carousel/phone-carousel.component';
import { PhoneInterestModalComponent } from './components/phone-interest-modal/phone-interest-modal.component';

/**
 * Sección "TELÉFONOS" de la landing pública — catálogo visual premium
 * (carousel 3D) de los teléfonos publicados desde el panel. Si el catálogo
 * está vacío (sin teléfonos publicados), la sección simplemente no se
 * renderiza — nunca se muestra un carousel vacío ni datos de ejemplo
 * hardcodeados.
 */
@Component({
  selector: 'app-phones',
  standalone: true,
  imports: [SectionComponent, SectionHeadingComponent, RevealOnScrollDirective, PhoneCarouselComponent, PhoneInterestModalComponent],
  templateUrl: './phones.component.html',
  styleUrl: './phones.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonesComponent {
  private readonly publicCatalogService = inject(PublicCatalogService);

  readonly phones = signal<PublicCatalogPhone[]>([]);
  readonly loading = signal(true);

  readonly selectedPhone = signal<PublicCatalogPhone | null>(null);
  readonly selectedRequestType = signal<CatalogRequestType | null>(null);

  constructor() {
    this.publicCatalogService.getPublishedPhones().subscribe({
      next: (phones) => {
        this.phones.set(phones);
        this.loading.set(false);
      },
      error: (_error: HttpErrorResponse) => {
        // Sección opcional de la landing — un fallo de red aquí no debe romper el resto de la página, solo se oculta.
        this.loading.set(false);
      },
    });
  }

  onRequestInterest(event: PhoneInterestEvent): void {
    this.selectedPhone.set(event.phone);
    this.selectedRequestType.set(event.requestType);
  }

  closeInterestModal(): void {
    this.selectedPhone.set(null);
    this.selectedRequestType.set(null);
  }
}
