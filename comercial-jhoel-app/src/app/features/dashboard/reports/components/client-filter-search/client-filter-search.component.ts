import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { Client } from '../../../../../core/models';
import { ClientService } from '../../../../../core/services/client.service';
import { IconComponent } from '../../../../../shared/ui';

/**
 * A near-copy of this same folder's `ProductFilterSearchComponent`, adapted
 * for clients. The dropdown's base list (empty query) is the full
 * active-clients list, fetched once; once the user types, matching is
 * delegated to the backend's accent/case-insensitive `search_normalize()`-
 * based `search` param (debounced), never a `.toLowerCase().includes()`
 * filter in JS — see `ClientService.getClients`. Shared by both the
 * Cuentas por Cobrar and Activos reports (same reasoning
 * `ProductFilterSearchComponent` is already shared by Sales'/Purchases'
 * own reports), rather than duplicated a third/fourth time — it has no
 * report-specific logic baked in.
 */
@Component({
  selector: 'app-report-client-filter',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './client-filter-search.component.html',
  styleUrl: './client-filter-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFilterSearchComponent {
  @Input() selectedClient: Client | null = null;
  @Output() selectionChange = new EventEmitter<Client | null>();

  private readonly clientService = inject(ClientService);

  private readonly clients = signal<Client[]>([]);
  private readonly clientsLoaded = signal(false);
  private readonly searchResults = signal<Client[] | null>(null);
  private readonly query$ = new Subject<string>();

  readonly query = signal('');
  readonly open = signal(false);
  readonly loading = computed(() => !this.clientsLoaded());

  /** With a query, `searchResults()` (backend, accent/case-insensitive) — never a JS `.includes()` filter. */
  readonly filteredClients = computed(() => {
    const term = this.query().trim();
    return term ? (this.searchResults() ?? []) : this.clients();
  });

  constructor() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.clientsLoaded.set(true);
      },
      error: () => this.clientsLoaded.set(true),
    });

    this.query$.pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed()).subscribe((term) => {
      const trimmed = term.trim();
      if (!trimmed) {
        this.searchResults.set(null);
        return;
      }
      this.clientService.getClients(false, trimmed).subscribe({
        next: (clients) => this.searchResults.set(clients),
        error: () => this.searchResults.set([]),
      });
    });
  }

  onInput(value: string): void {
    this.query.set(value);
    this.open.set(true);
    if (!value.trim()) {
      this.searchResults.set(null);
    }
    this.query$.next(value);
  }

  onFocus(): void {
    this.open.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.open.set(false), 150);
  }

  select(client: Client): void {
    this.selectionChange.emit(client);
    this.query.set('');
    this.searchResults.set(null);
    this.open.set(false);
  }

  clear(): void {
    this.selectionChange.emit(null);
    this.searchResults.set(null);
  }
}
