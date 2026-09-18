import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PublicCatalogBank } from '../../../../core/models';
import { PublicCatalogBankService } from '../../../../core/services/public-catalog-bank.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { ImageLightboxComponent, SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { BankCardComponent } from './components/bank-card/bank-card.component';

/**
 * Sección "BANCOS" de la landing pública — catálogo informativo con flip
 * 3D (imagen + nombre al frente, descripción + información adicional al
 * reverso). Completamente independiente del módulo financiero de Bancos
 * (Agentes Bancarios/Cuadre) y de su propia sección `<app-bank-agents />`.
 * Si no hay bancos publicados, la sección no se renderiza.
 */
@Component({
  selector: 'app-catalog-banks',
  standalone: true,
  imports: [SectionComponent, SectionHeadingComponent, RevealOnScrollDirective, BankCardComponent, ImageLightboxComponent],
  templateUrl: './catalog-banks.component.html',
  styleUrl: './catalog-banks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogBanksComponent {
  private readonly publicCatalogBankService = inject(PublicCatalogBankService);

  readonly banks = signal<PublicCatalogBank[]>([]);
  readonly loading = signal(true);

  readonly zoomedImageUrl = signal<string | null>(null);
  readonly zoomedImageAlt = signal('');

  constructor() {
    this.publicCatalogBankService.getPublishedBanks().subscribe({
      next: (banks) => {
        this.banks.set(banks);
        this.loading.set(false);
      },
      error: (_error: HttpErrorResponse) => {
        // Sección opcional de la landing — un fallo de red aquí no debe romper el resto de la página, solo se oculta.
        this.loading.set(false);
      },
    });
  }

  onImageZoom(event: { url: string; alt: string }): void {
    this.zoomedImageUrl.set(event.url);
    this.zoomedImageAlt.set(event.alt);
  }

  closeImageLightbox(): void {
    this.zoomedImageUrl.set(null);
  }
}
