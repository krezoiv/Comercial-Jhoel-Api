import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';

import { CASH_CUT_NAME, CashInventory, LocationInventory, WarehouseCashCount, formatCurrency } from '../../../../../core/models';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { onCashChanged } from '../../../../../core/services/cash-control-sync.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime } from '../../cash-control.util';
import { WarehouseCountModalComponent } from '../warehouse-count-modal/warehouse-count-modal.component';

/**
 * "Inventario de efectivo": bills and coins available in CAJA and in BODEGA,
 * as the backend derives them (latest physical count of each location + later
 * movements with denominations). Shows each location's anchor (which count it
 * starts from), the total known by denomination, the cash that moved without
 * breakdown and the official balance. Administrators register the Bodega
 * per-denomination count here. Nothing is computed in this component; it
 * reloads on every cash change (`onCashChanged`) and when `refreshKey` moves.
 */
@Component({
  selector: 'app-cash-inventory-panel',
  standalone: true,
  imports: [ButtonComponent, IconComponent, WarehouseCountModalComponent],
  templateUrl: './cash-inventory-panel.component.html',
  styleUrls: ['../warehouse-panel/warehouse-panel.component.scss', './cash-inventory-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashInventoryPanelComponent implements OnChanges {
  @Input() refreshKey = 0;
  /** Administrators may register the Bodega count. */
  @Input() isAdmin = false;
  @Output() changed = new EventEmitter<void>();

  private readonly service = inject(CashCustodyService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;

  readonly inventory = signal<CashInventory | null>(null);
  readonly counts = signal<WarehouseCashCount[]>([]);
  readonly failed = signal(false);
  readonly countOpen = signal(false);

  constructor() {
    onCashChanged(() => this.load());
  }

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    this.service.getInventory().subscribe({
      next: (inventory) => {
        this.inventory.set(inventory);
        this.failed.set(false);
      },
      error: () => this.failed.set(true),
    });
    this.service.getWarehouseCounts(1, 5).subscribe({
      next: (page) => this.counts.set(page.items),
      error: () => this.counts.set([]),
    });
  }

  /** "Arqueo #12 · 16/11/2026 18:05 · ana" — where the inventory of a location starts. */
  anchorLabel(inv: LocationInventory): string {
    if (!inv.hasAnchor) {
      return inv.location === 'CAJA'
        ? 'Sin arqueo de caja: registra un arqueo para conocer los billetes y monedas.'
        : 'Sin conteo inicial: un administrador debe registrar el conteo de Bodega.';
    }
    const what =
      inv.anchorKind === 'ARQUEO_CAJA'
        ? `Arqueo de caja #${inv.anchorNumber}`
        : inv.anchorKind === 'CORTE_CAJA'
          ? `Arqueo del ${CASH_CUT_NAME[(inv.anchorNumber as 1 | 2) ?? 1].toLowerCase()}`
          : `Conteo de Bodega #${inv.anchorNumber}`;
    return `${what} · ${inv.anchorAt ? this.formatDateTime(inv.anchorAt) : ''}${inv.anchorByUsername ? ' · ' + inv.anchorByUsername : ''}`;
  }

  denominationLabel(value: number): string {
    return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: value < 1 ? 2 : 0 })}`;
  }

  onCountSaved(): void {
    this.countOpen.set(false);
    this.load();
    this.changed.emit();
  }
}
