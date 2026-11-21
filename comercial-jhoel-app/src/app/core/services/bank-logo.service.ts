import { Injectable, inject, signal } from '@angular/core';

import { Bank, TransactionBank } from '../models';
import { findAccountRule, findTransactionBankRule, normalizeBankName } from '../utils/transaction-bank-account.util';
import { TransactionBankService, transactionBankImageUrl } from './transaction-bank.service';

/** How a bank account is drawn: its existing logo, or a monogram on a neutral colour. */
export interface BankVisual {
  monogram: string;
  imageUrl: string | null;
  /** Neutral, muted colour for the monogram tile (never presented as the bank's official colour). */
  tone: string;
}

/** Muted tones for banks without a logo — differentiated, never "brand" colours. */
const TONES = ['#2563eb', '#0d9488', '#7c3aed', '#c2410c', '#0891b2', '#be185d', '#4f46e5', '#4d7c0f', '#475569'];

function hash(value: string): number {
  let result = 0;
  for (const char of value) {
    result = (result * 31 + char.charCodeAt(0)) >>> 0;
  }
  return result;
}

function initials(name: string): string {
  const words = normalizeBankName(name)
    .split(' ')
    .filter((word) => word && !['banco', 'de', 'del', 'la', 'los', 'cuenta'].includes(word));
  const source = words.length ? words : normalizeBankName(name).split(' ').filter(Boolean);
  return source
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Logos of the bank accounts. They are the images already uploaded for each
 * "Banco Agente" (Sistema → Banco Agente), matched to the account through the
 * single mapping of `transaction-bank-account.util`. Accounts with no logo get
 * a monogram on a neutral tone — no official logo is ever invented.
 *
 * The agent catalog is read once per session (shared by every card on screen).
 */
@Injectable({ providedIn: 'root' })
export class BankLogoService {
  private readonly transactionBanks = inject(TransactionBankService);
  private readonly agents = signal<TransactionBank[]>([]);
  private requested = false;

  private ensureLoaded(): void {
    if (this.requested) {
      return;
    }
    this.requested = true;
    this.transactionBanks.getTransactionBanks().subscribe({
      next: (agents) => this.agents.set(agents),
      // Without the catalog every account simply shows its monogram.
      error: () => this.agents.set([]),
    });
  }

  /** Reactive: re-evaluates when the agent catalog arrives. */
  visualFor(account: Pick<Bank, 'name' | 'specialAccount'>): BankVisual {
    this.ensureLoaded();
    const rule = findAccountRule(account);
    const agent = rule
      ? this.agents().find((candidate) => candidate.hasImage && findTransactionBankRule(candidate)?.key === rule.key)
      : undefined;
    const key = rule?.key ?? normalizeBankName(account.name);
    return {
      monogram: rule?.monogram ?? initials(account.name),
      imageUrl: agent ? transactionBankImageUrl(agent) : null,
      tone: TONES[hash(key) % TONES.length],
    };
  }
}
