import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { Phone, formatCurrency, formatQuantity } from '../../../../../../core/models';
import { CardComponent, SummaryTileComponent, SummaryTileTone } from '../../../../../../shared/ui';

interface SummaryTile {
  icon: string;
  title: string;
  value: string;
  description: string;
  tone: SummaryTileTone;
}

/**
 * KPI tiles for Inventario de Teléfonos — computed client-side from the
 * already-fetched `phones` list, same "no separate summary endpoint" pattern
 * as `InventorySummaryComponent`. Costo/Valor público/Margen only ever count
 * `DISPONIBLE` phones, per the plan's own explicit rule.
 */
@Component({
  selector: 'app-phones-summary',
  standalone: true,
  imports: [CardComponent, SummaryTileComponent],
  templateUrl: './phones-summary.component.html',
  styleUrl: './phones-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonesSummaryComponent {
  private readonly phonesValue = signal<Phone[]>([]);

  @Input()
  set phones(value: Phone[]) {
    this.phonesValue.set(value);
  }

  readonly tiles = computed<SummaryTile[]>(() => {
    const phones = this.phonesValue();
    const available = phones.filter((phone) => phone.status === 'DISPONIBLE');
    const sold = phones.filter((phone) => phone.status === 'VENDIDO');
    const costValue = available.reduce((sum, phone) => sum + phone.costPrice, 0);
    const publicValue = available.reduce((sum, phone) => sum + phone.publicPrice, 0);

    return [
      {
        icon: 'smartphone',
        title: 'Total de teléfonos',
        value: formatQuantity(phones.length),
        description: 'equipos registrados',
        tone: 'primary',
      },
      {
        icon: 'package',
        title: 'Disponibles',
        value: formatQuantity(available.length),
        description: 'listos para vender',
        tone: 'success',
      },
      {
        icon: 'shopping-bag',
        title: 'Vendidos',
        value: formatQuantity(sold.length),
        description: 'equipos ya vendidos',
        tone: 'neutral',
      },
      {
        icon: 'wallet',
        title: 'Costo de inventario',
        value: formatCurrency(costValue),
        description: 'solo disponibles',
        tone: 'gold',
      },
      {
        icon: 'trending-up',
        title: 'Valor público',
        value: formatCurrency(publicValue),
        description: 'solo disponibles',
        tone: 'gold',
      },
      {
        icon: 'bar-chart',
        title: 'Margen potencial',
        value: formatCurrency(publicValue - costValue),
        description: 'valor público − costo',
        tone: 'success',
      },
    ];
  });
}
