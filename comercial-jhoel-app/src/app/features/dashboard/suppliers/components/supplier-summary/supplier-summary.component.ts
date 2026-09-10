import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { Supplier } from '../../../../../core/models';
import { CardComponent, SummaryTileComponent, SummaryTileTone } from '../../../../../shared/ui';

interface SummaryTile {
  icon: string;
  title: string;
  value: string;
  description: string;
  tone: SummaryTileTone;
}

@Component({
  selector: 'app-supplier-summary',
  standalone: true,
  imports: [CardComponent, SummaryTileComponent],
  templateUrl: './supplier-summary.component.html',
  styleUrl: './supplier-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierSummaryComponent {
  private readonly suppliers = signal<Supplier[]>([]);

  @Input({ required: true })
  set data(value: Supplier[]) {
    this.suppliers.set(value);
  }

  readonly tiles = computed<SummaryTile[]>(() => {
    const suppliers = this.suppliers();
    const active = suppliers.filter((s) => s.isActive).length;
    const inactive = suppliers.length - active;

    return [
      {
        icon: 'truck',
        title: 'Total de proveedores',
        value: `${suppliers.length}`,
        description: 'proveedores registrados',
        tone: 'primary',
      },
      {
        icon: 'check',
        title: 'Activos',
        value: `${active}`,
        description: 'disponibles para compras',
        tone: 'success',
      },
      {
        icon: 'x-circle',
        title: 'Inactivos',
        value: `${inactive}`,
        description: 'desactivados',
        tone: 'danger',
      },
    ];
  });
}
