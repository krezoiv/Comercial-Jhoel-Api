import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { Client } from '../../../../../core/models';
import { CardComponent, SummaryTileComponent, SummaryTileTone } from '../../../../../shared/ui';

interface SummaryTile {
  icon: string;
  title: string;
  value: string;
  description: string;
  tone: SummaryTileTone;
}

@Component({
  selector: 'app-client-summary',
  standalone: true,
  imports: [CardComponent, SummaryTileComponent],
  templateUrl: './client-summary.component.html',
  styleUrl: './client-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientSummaryComponent {
  private readonly clients = signal<Client[]>([]);

  @Input({ required: true })
  set data(value: Client[]) {
    this.clients.set(value);
  }

  readonly tiles = computed<SummaryTile[]>(() => {
    const clients = this.clients();
    const active = clients.filter((c) => c.isActive).length;
    const inactive = clients.length - active;

    return [
      {
        icon: 'users',
        title: 'Total de clientes',
        value: `${clients.length}`,
        description: 'clientes registrados',
        tone: 'primary',
      },
      {
        icon: 'check',
        title: 'Activos',
        value: `${active}`,
        description: 'disponibles para ventas',
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
