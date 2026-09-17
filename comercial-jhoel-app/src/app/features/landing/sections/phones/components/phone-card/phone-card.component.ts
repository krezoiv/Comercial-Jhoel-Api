import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';

import { CatalogRequestType, PublicCatalogPhone } from '../../../../../../core/models';
import { PublicCatalogService } from '../../../../../../core/services/public-catalog.service';
import { BadgeComponent, ButtonComponent, IconComponent } from '../../../../../../shared/ui';

interface DisplaySpec {
  label: string;
  value: string;
}

/**
 * Card individual del carousel — frente (imagen, marca/modelo/precio,
 * badges) y reverso (specs completas + CTAs) unidos por un flip 3D CSS
 * puro (`preserve-3d`/`rotateY`, sin librería de animación — ninguna está
 * instalada en el proyecto). El click en la card entera es solo
 * conveniencia de mouse; el botón "Ver especificaciones" es el control real
 * accesible por teclado (evita anidar un botón dentro de otro elemento con
 * rol de botón).
 */
@Component({
  selector: 'app-phone-card',
  standalone: true,
  imports: [DecimalPipe, BadgeComponent, ButtonComponent, IconComponent],
  templateUrl: './phone-card.component.html',
  styleUrl: './phone-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneCardComponent {
  @Input({ required: true }) phone!: PublicCatalogPhone;

  @Output() interest = new EventEmitter<CatalogRequestType>();

  private readonly publicCatalogService = inject(PublicCatalogService);

  readonly flipped = signal(false);

  readonly primaryImageUrl = computed(() => {
    const images = this.phone.images;
    if (images.length === 0) {
      return null;
    }
    const primary = images.find((image) => image.isPrimary) ?? images[0];
    return this.publicCatalogService.getImageUrl(primary.id);
  });

  readonly specs = computed<DisplaySpec[]>(() => {
    const phone = this.phone;
    const fixed: DisplaySpec[] = [
      { label: 'Pantalla', value: phone.screen ?? '' },
      { label: 'RAM', value: phone.ram ?? '' },
      { label: 'Almacenamiento', value: phone.storage ?? '' },
      { label: 'Cámara', value: phone.camera ?? '' },
      { label: 'Batería', value: phone.battery ?? '' },
      { label: 'Procesador', value: phone.processor ?? '' },
      { label: 'Sistema operativo', value: phone.operatingSystem ?? '' },
    ].filter((spec) => spec.value);

    return [...fixed, ...phone.extraSpecs];
  });

  toggleFlip(): void {
    this.flipped.update((value) => !value);
  }

  requestInterest(type: CatalogRequestType): void {
    this.interest.emit(type);
  }
}
