import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { Client } from '../../../core/models';
import { ClientService } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { PageHeaderComponent } from '../../../shared/ui';
import { ClientSummaryComponent } from './components/client-summary/client-summary.component';
import { ClientToolbarComponent, ClientStatusFilterValue } from './components/client-toolbar/client-toolbar.component';
import { ClientTableComponent } from './components/client-table/client-table.component';
import { ClientFormModalComponent } from './components/client-form-modal/client-form-modal.component';
import { DeleteConfirmModalComponent } from './components/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ClientSummaryComponent,
    ClientToolbarComponent,
    ClientTableComponent,
    ClientFormModalComponent,
    DeleteConfirmModalComponent,
  ],
  templateUrl: './clients-page.component.html',
  styleUrl: './clients-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** A structural clone of `CategoriesPageComponent` — see that component's own doc comment. */
export class ClientsPageComponent {
  private readonly clientService = inject(ClientService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  /** ADMIN/SUPER_ADMIN only — passed down to hide add/edit/delete for other roles. The backend enforces this regardless. */
  readonly isAdmin = this.authService.isAdmin;

  /** The full catalog — always the unfiltered list, so summary tiles never shrink while searching. */
  readonly clients = signal<Client[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<ClientStatusFilterValue>('all');
  /** `null` = no active server search; set from the debounced backend search below. */
  private readonly searchResults = signal<Client[] | null>(null);
  private readonly searchTerm$ = new Subject<string>();

  readonly isFormOpen = signal(false);
  readonly editingClient = signal<Client | null>(null);

  readonly isDeleteOpen = signal(false);
  readonly deletingClient = signal<Client | null>(null);
  readonly isDeleting = signal(false);

  /**
   * With a search term, the backend already matched `name` accent/case-insensitively
   * (see `ClientService.getClients`'s `search` param, backed by `search_normalize()`)
   * — this only narrows further by status, never re-does text matching in JS.
   */
  readonly filteredClients = computed(() => {
    const term = this.searchTerm().trim();
    const status = this.statusFilter();
    const base = term ? (this.searchResults() ?? []) : this.clients();

    return base.filter((client) => {
      const matchesStatus = status === 'all' || (status === 'active' ? client.isActive : !client.isActive);
      return matchesStatus;
    });
  });

  readonly hasActiveFilters = computed(
    () => this.searchTerm().trim().length > 0 || this.statusFilter() !== 'all',
  );

  constructor() {
    this.fetchClients();

    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        const trimmed = term.trim();
        if (!trimmed) {
          this.searchResults.set(null);
          return;
        }
        this.clientService.getClients(true, trimmed).subscribe({
          next: (clients) => this.searchResults.set(clients),
          error: () => this.notificationService.error('No se pudo buscar clientes.'),
        });
      });
  }

  private fetchClients(): void {
    this.loading.set(true);
    // Admin management screen — shows inactive clients too (with a status badge/filter).
    this.clientService.getClients(true).subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los clientes.'));
      },
    });
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    if (!value.trim()) {
      this.searchResults.set(null);
    }
    this.searchTerm$.next(value);
  }

  openCreateForm(): void {
    this.editingClient.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(client: Client): void {
    this.editingClient.set(client);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onClientSaved(client: Client): void {
    const wasEditing = this.editingClient() !== null;
    this.isFormOpen.set(false);

    this.clients.update((list) =>
      wasEditing ? list.map((c) => (c.id === client.id ? client : c)) : [client, ...list],
    );

    this.notificationService.success(
      wasEditing ? `"${client.name}" se actualizó correctamente.` : `"${client.name}" se agregó correctamente.`,
    );
  }

  requestDelete(client: Client): void {
    this.deletingClient.set(client);
    this.isDeleteOpen.set(true);
  }

  cancelDelete(): void {
    this.isDeleteOpen.set(false);
    this.deletingClient.set(null);
  }

  confirmDelete(): void {
    const client = this.deletingClient();
    if (!client) {
      return;
    }

    this.isDeleting.set(true);
    this.clientService.deleteClient(client.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteOpen.set(false);
        this.deletingClient.set(null);
        this.clients.update((list) =>
          list.map((c) => (c.id === client.id ? { ...c, isActive: false } : c)),
        );
        this.notificationService.success(`"${client.name}" se desactivó correctamente.`);
      },
      error: (error: HttpErrorResponse) => {
        this.isDeleting.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo desactivar el cliente.'));
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
    this.searchResults.set(null);
  }
}
