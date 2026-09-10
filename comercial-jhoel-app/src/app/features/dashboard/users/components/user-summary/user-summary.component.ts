import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { User } from '../../../../../core/models';
import { CardComponent, SummaryTileComponent, SummaryTileTone } from '../../../../../shared/ui';

interface SummaryTile {
  icon: string;
  title: string;
  value: string;
  description: string;
  tone: SummaryTileTone;
}

@Component({
  selector: 'app-user-summary',
  standalone: true,
  imports: [CardComponent, SummaryTileComponent],
  templateUrl: './user-summary.component.html',
  styleUrl: './user-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSummaryComponent {
  private readonly users = signal<User[]>([]);

  @Input({ required: true })
  set data(value: User[]) {
    this.users.set(value);
  }

  readonly tiles = computed<SummaryTile[]>(() => {
    const users = this.users();
    const active = users.filter((u) => u.isActive).length;
    const inactive = users.length - active;

    return [
      {
        icon: 'users',
        title: 'Total de usuarios',
        value: `${users.length}`,
        description: 'cuentas registradas',
        tone: 'primary',
      },
      {
        icon: 'check',
        title: 'Activos',
        value: `${active}`,
        description: 'pueden iniciar sesión',
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
