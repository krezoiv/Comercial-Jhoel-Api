import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

import { SITE } from '../../../../core/data';
import { ContactService } from '../../../../core/services/contact.service';
import { BadgeComponent, ButtonComponent, ContainerComponent, IconComponent } from '../../../../shared/ui';
import { HeroShowcaseComponent } from './hero-showcase.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ContainerComponent, BadgeComponent, ButtonComponent, IconComponent, HeroShowcaseComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private readonly contactService = inject(ContactService);

  /**
   * Set by `LandingPageComponent` once its intro loading screen finishes —
   * `false` for the brief window while that overlay is still covering the
   * hero, so the entrance animation below only starts the instant it's
   * actually visible instead of having already finished behind an opaque
   * screen. Defaults `true` so this component still animates in correctly
   * if ever used/tested standalone, without `LandingPageComponent`.
   */
  readonly ready = input(true);

  readonly site = SITE;

  /** Real WhatsApp link (`company_settings.whatsapp`, via the same `ContactService` the Contacto section/Footer already use) — `null` (button hidden) until the admin configures a real number, never the old hardcoded placeholder. */
  readonly whatsappHref = signal<string | null>(null);

  constructor() {
    this.contactService
      .getContactInfo()
      .pipe(catchError(() => of(null)))
      .subscribe((info) => {
        const whatsapp = info?.channels.find((channel) => channel.id === 'whatsapp');
        this.whatsappHref.set(whatsapp?.href ?? null);
      });
  }
}
