import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';

import { PublicCatalogBank } from '../../../../../../core/models';
import { PublicCatalogBankService } from '../../../../../../core/services/public-catalog-bank.service';
import { IconComponent } from '../../../../../../shared/ui';

/**
 * Card individual del catálogo de Bancos — frente (imagen + nombre) y
 * reverso (nombre + descripción + información adicional) unidos por el
 * mismo flip 3D CSS puro ya usado en Teléfonos/Librería/Variedades
 * (`preserve-3d`/`rotateY`, sin librería de animación). Clonado de
 * `CatalogProductCardComponent` — mismo patrón, forma de datos distinta
 * (sin precio/categoría/"Lo quiero": este catálogo es puramente
 * informativo). Sin Like (no fue pedido, fuera de alcance).
 */
@Component({
  selector: 'app-bank-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './bank-card.component.html',
  styleUrl: './bank-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankCardComponent {
  @Input({ required: true }) bank!: PublicCatalogBank;
  /** Solo para la "Vista previa" del admin — fuerza mostrar el reverso sin depender de un click. `null` = comportamiento normal (clic para girar). */
  @Input() forceFlipped: boolean | null = null;

  /** El zoom de imagen se abre desde un componente de sección (montado fuera del árbol con flip 3D) — ver `ImageLightboxComponent`. */
  @Output() imageZoom = new EventEmitter<{ url: string; alt: string }>();

  private readonly publicCatalogBankService = inject(PublicCatalogBankService);

  private readonly flippedByClick = signal(false);

  readonly imageUrl = computed(() =>
    this.bank.hasImage ? this.publicCatalogBankService.getImageUrl(this.bank.id) : null,
  );

  readonly flipped = computed(() => this.forceFlipped ?? this.flippedByClick());

  toggleFlip(): void {
    if (this.forceFlipped !== null) {
      return;
    }
    this.flippedByClick.update((value) => !value);
  }

  onImageClick(event: Event): void {
    event.stopPropagation();
    const url = this.imageUrl();
    if (!url) {
      return;
    }
    this.imageZoom.emit({ url, alt: this.bank.name });
  }
}
