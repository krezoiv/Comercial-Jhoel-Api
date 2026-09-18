import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CatalogBank } from '../../../core/models';
import { CatalogBankService } from '../../../core/services/catalog-bank.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { CatalogBankTableComponent } from './components/catalog-bank-table/catalog-bank-table.component';
import { BankFormModalComponent } from './components/bank-form-modal/bank-form-modal.component';
import { BankImageModalComponent } from './components/bank-image-modal/bank-image-modal.component';
import { BankPreviewModalComponent } from './components/bank-preview-modal/bank-preview-modal.component';

type StatusFilter = 'all' | 'active' | 'inactive';

/**
 * "Sistema → Catálogo de Bancos" — catálogo público informativo (imagen, nombre,
 * descripción, información adicional, orden, estado). Nunca relacionado con el
 * módulo financiero "Bancos" (Agentes Bancarios/Cuadre) — clon estructural de
 * `NewsPageComponent`.
 */
@Component({
  selector: 'app-catalog-banks-page',
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    CatalogBankTableComponent,
    BankFormModalComponent,
    BankImageModalComponent,
    BankPreviewModalComponent,
  ],
  templateUrl: './catalog-banks-page.component.html',
  styleUrl: './catalog-banks-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogBanksPageComponent {
  private readonly catalogBankService = inject(CatalogBankService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly banks = signal<CatalogBank[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('all');

  readonly isFormOpen = signal(false);
  readonly editingBank = signal<CatalogBank | null>(null);

  readonly imageBank = signal<CatalogBank | null>(null);
  readonly previewBank = signal<CatalogBank | null>(null);

  readonly filteredBanks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.banks().filter((bank) => {
      const matchesTerm = !term || bank.name.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || (status === 'active' && bank.isActive) || (status === 'inactive' && !bank.isActive);
      return matchesTerm && matchesStatus;
    });
  });

  readonly hasActiveFilters = computed(() => this.searchTerm().trim().length > 0 || this.statusFilter() !== 'all');

  readonly statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  constructor() {
    this.fetchBanks();
  }

  fetchBanks(): void {
    this.loading.set(true);
    this.catalogBankService.getBanks(true).subscribe({
      next: (banks) => {
        this.banks.set(banks);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los bancos.'));
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
  }

  openCreateForm(): void {
    this.editingBank.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(bank: CatalogBank): void {
    this.editingBank.set(bank);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onBankSaved(bank: CatalogBank): void {
    const wasEditing = this.editingBank() !== null;
    this.isFormOpen.set(false);

    this.banks.update((list) => (wasEditing ? list.map((b) => (b.id === bank.id ? bank : b)) : [bank, ...list]));

    this.notificationService.success(wasEditing ? `"${bank.name}" se actualizó correctamente.` : `"${bank.name}" se creó correctamente.`);

    if (!wasEditing) {
      // Un banco recién creado no tiene imagen — se abre directo el gestor.
      this.imageBank.set(bank);
    }
  }

  openImage(bank: CatalogBank): void {
    this.imageBank.set(bank);
  }

  closeImage(): void {
    this.imageBank.set(null);
  }

  onImageChanged(bank: CatalogBank): void {
    this.imageBank.set(bank);
    this.banks.update((list) => list.map((b) => (b.id === bank.id ? bank : b)));
  }

  openPreview(bank: CatalogBank): void {
    this.previewBank.set(bank);
  }

  closePreview(): void {
    this.previewBank.set(null);
  }

  async toggleActive(bank: CatalogBank): Promise<void> {
    const activating = !bank.isActive;
    const confirmed = await this.confirmDialogService.confirm({
      type: activating ? 'UPDATE' : 'DELETE',
      title: activating ? 'Activar banco' : 'Desactivar banco',
      message: activating
        ? `¿Desea activar "${bank.name}"?`
        : `¿Desea desactivar "${bank.name}"? Se ocultará del catálogo público, pero se conservará el histórico.`,
    });
    if (!confirmed) {
      return;
    }

    const request$ = activating ? this.catalogBankService.activateBank(bank.id) : this.catalogBankService.deactivateBank(bank.id);
    request$.subscribe({
      next: () => {
        this.banks.update((list) => list.map((b) => (b.id === bank.id ? { ...b, isActive: activating } : b)));
        this.notificationService.success(activating ? 'Banco activado correctamente.' : 'Banco desactivado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar el estado del banco.'));
      },
    });
  }

  moveUp(bank: CatalogBank): void {
    const list = this.banks();
    const index = list.findIndex((b) => b.id === bank.id);
    if (index <= 0) {
      return;
    }
    this.swapOrder(list, index, index - 1);
  }

  moveDown(bank: CatalogBank): void {
    const list = this.banks();
    const index = list.findIndex((b) => b.id === bank.id);
    if (index === -1 || index >= list.length - 1) {
      return;
    }
    this.swapOrder(list, index, index + 1);
  }

  private swapOrder(list: CatalogBank[], indexA: number, indexB: number): void {
    const reordered = [...list];
    [reordered[indexA], reordered[indexB]] = [reordered[indexB], reordered[indexA]];

    const items = reordered.map((bank, index) => ({ id: bank.id, sortOrder: index }));
    this.catalogBankService.reorderBanks(items).subscribe({
      next: () => {
        this.banks.set(reordered.map((bank, index) => ({ ...bank, sortOrder: index })));
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cambiar el orden.'));
      },
    });
  }
}
