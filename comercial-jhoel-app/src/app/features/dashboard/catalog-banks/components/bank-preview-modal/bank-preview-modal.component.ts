import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

import { CatalogBank, PublicCatalogBank } from '../../../../../core/models';
import { BankCardComponent } from '../../../../landing/sections/catalog-banks/components/bank-card/bank-card.component';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * "Vista previa" — monta la MISMA `BankCardComponent` que se renderiza en
 * la landing pública (nunca una reconstrucción aparte), así la vista
 * previa nunca se desincroniza de cómo se ve en producción. `forceFlipped`
 * le permite al admin alternar frente/reverso con un botón, sin depender
 * del clic normal de la card.
 */
@Component({
  selector: 'app-bank-preview-modal',
  standalone: true,
  imports: [BankCardComponent, ButtonComponent, IconComponent],
  templateUrl: './bank-preview-modal.component.html',
  styleUrl: './bank-preview-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankPreviewModalComponent {
  @Input() bank: CatalogBank | null = null;

  @Output() closed = new EventEmitter<void>();

  readonly showBack = signal(false);

  readonly previewBank = computed<PublicCatalogBank | null>(() => {
    const bank = this.bank;
    if (!bank) {
      return null;
    }
    return {
      id: bank.id,
      name: bank.name,
      description: bank.description,
      additionalInfo: bank.additionalInfo,
      hasImage: bank.hasImage,
    };
  });

  get open(): boolean {
    return this.bank !== null;
  }

  toggleFace(): void {
    this.showBack.update((value) => !value);
  }

  close(): void {
    this.showBack.set(false);
    this.closed.emit();
  }
}
