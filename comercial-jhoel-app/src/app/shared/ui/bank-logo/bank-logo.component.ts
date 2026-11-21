import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { BankSpecialAccount } from '../../../core/models';
import { BankLogoService } from '../../../core/services/bank-logo.service';

/**
 * Bank logo of a fixed size: the bank's uploaded logo (contained, never
 * stretched) or its monogram on a neutral tone. Same size for every bank so
 * no logo looks larger than the others.
 */
@Component({
  selector: 'app-bank-logo',
  standalone: true,
  host: { '[attr.data-size]': 'size()' },
  template: `
    @let v = visual();
    <span class="logo" [class.logo--image]="!!v.imageUrl" [style.--tone]="v.tone" aria-hidden="true">
      @if (v.imageUrl) {
        <img [src]="v.imageUrl" alt="" loading="lazy" />
      } @else {
        {{ v.monogram }}
      }
    </span>
  `,
  styles: `
    :host {
      --size: 2.5rem;
      display: inline-flex;
      flex-shrink: 0;
    }

    :host([data-size='sm']) {
      --size: 2rem;
    }

    :host([data-size='lg']) {
      --size: 3rem;
    }

    .logo {
      display: grid;
      place-items: center;
      width: var(--size);
      height: var(--size);
      overflow: hidden;
      border-radius: 30%;
      background: linear-gradient(135deg, color-mix(in srgb, var(--tone) 16%, #fff), color-mix(in srgb, var(--tone) 30%, #fff));
      color: color-mix(in srgb, var(--tone) 85%, #000);
      font-family: var(--font-heading);
      font-size: calc(var(--size) * 0.34);
      font-weight: var(--fw-bold, 700);
      letter-spacing: 0.02em;
    }

    .logo--image {
      padding: 4px;
      background: #fff;
      border: 1px solid var(--color-border-light);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankLogoComponent {
  private readonly logos = inject(BankLogoService);

  readonly name = input.required<string>();
  readonly specialAccount = input<BankSpecialAccount | null>(null);
  /** sm = 2rem · md = 2.5rem · lg = 3rem. */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly visual = computed(() => this.logos.visualFor({ name: this.name(), specialAccount: this.specialAccount() }));
}
