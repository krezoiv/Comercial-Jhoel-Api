import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';

import { Bank } from '../../../core/models';
import { normalizeBankName } from '../../../core/utils/transaction-bank-account.util';
import { BankBalanceAmountComponent } from '../bank-balance-amount/bank-balance-amount.component';
import { BankLogoComponent } from '../bank-logo/bank-logo.component';
import { IconComponent } from '../icon/icon.component';

/** A non-account choice shown as a card next to the accounts (e.g. "Retiro de efectivo en banco"). */
export interface BankPickerExtraOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  /** When set, the card is disabled and shows this reason. */
  blockedReason?: string | null;
}

/** From how many accounts on the search box is shown. */
const SEARCH_FROM = 7;

/**
 * Visual selection of a bank account: one card per account with its logo,
 * name, account type and number, and current balance (from the backend, with
 * its real sign). It only EMITS the chosen id — the page keeps every rule,
 * preview and validation it already had (the same signals the dropdowns
 * used). Accounts the page blocks are shown disabled with their reason.
 *
 * With `collapsible`, once an account is chosen the grid collapses to the
 * chosen card plus "Cambiar", so a long list does not push the form down.
 */
@Component({
  selector: 'app-bank-account-picker',
  standalone: true,
  imports: [IconComponent, BankLogoComponent, BankBalanceAmountComponent],
  templateUrl: './bank-account-picker.component.html',
  styleUrl: './bank-account-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountPickerComponent {
  readonly accounts = input.required<Bank[]>();
  readonly selectedId = input('');
  /** Section title ("Cuenta de origen", "Cuenta destino", …). */
  readonly heading = input.required<string>();
  readonly step = input<number | null>(null);
  readonly balanceLabel = input('Saldo actual');
  readonly loading = input(false);
  /** The whole picker is locked (e.g. destination before choosing the source). */
  readonly disabled = input(false);
  readonly disabledMessage = input('');
  /** Accounts that cannot be chosen right now, with the reason shown on the card. */
  readonly blockedReasons = input<Record<string, string>>({});
  readonly extraOptions = input<BankPickerExtraOption[]>([]);
  readonly collapsible = input(false);
  readonly emptyMessage = input('No hay cuentas bancarias activas.');

  readonly selectedChange = output<string>();

  readonly query = signal('');
  readonly expanded = signal(true);
  readonly skeleton = [1, 2, 3, 4];

  readonly selectedAccount = computed(() => this.accounts().find((account) => account.id === this.selectedId()) ?? null);
  readonly selectedExtra = computed(() => this.extraOptions().find((option) => option.id === this.selectedId()) ?? null);
  readonly showSearch = computed(() => this.accounts().length >= SEARCH_FROM);
  readonly visibleAccounts = computed(() => {
    const query = normalizeBankName(this.query());
    if (!query) {
      return this.accounts();
    }
    return this.accounts().filter((account) =>
      normalizeBankName(`${account.name} ${account.accountTypeName} ${account.accountNumber}`).includes(query),
    );
  });
  /** Collapsed = a choice exists and the user has not asked to change it. */
  readonly collapsed = computed(
    () => this.collapsible() && !this.expanded() && (this.selectedAccount() !== null || this.selectedExtra() !== null),
  );

  constructor() {
    // A choice cleared by the page (reset, rule change) opens the grid again.
    effect(() => {
      if (!this.selectedId()) {
        this.expanded.set(true);
      }
    });
  }

  choose(id: string, blocked: string | null | undefined): void {
    if (this.disabled() || blocked) {
      return;
    }
    this.selectedChange.emit(id);
    this.query.set('');
    if (this.collapsible()) {
      this.expanded.set(false);
    }
  }

  change(): void {
    this.expanded.set(true);
  }

  reason(account: Bank): string | null {
    return this.blockedReasons()[account.id] ?? null;
  }
}
