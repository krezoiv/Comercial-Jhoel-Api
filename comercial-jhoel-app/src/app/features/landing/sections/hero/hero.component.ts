import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { SITE } from '../../../../core/data';
import { ContactService } from '../../../../core/services/contact.service';
import { BadgeComponent, ButtonComponent, ContainerComponent, IconComponent } from '../../../../shared/ui';
import { HeroShowcaseComponent } from './hero-showcase.component';
import { ParallaxLayerDirective } from '../../../../shared/directives/parallax-layer.directive';
import { SectionLandingBackgroundComponent } from '../shared/section-landing-background/section-landing-background.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    RouterLink,
    ContainerComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    HeroShowcaseComponent,
    ParallaxLayerDirective,
    SectionLandingBackgroundComponent,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private readonly contactService = inject(ContactService);

  /**
   * Ambient "light follows the cursor" — a radial-gradient layer whose
   * center tracks the mouse via `--mx`/`--my` (see hero.component.scss's
   * `.hero__cursor-light`), rAF-throttled and never attached at all on a
   * touch device (no `hover: hover`) or under `prefers-reduced-motion` —
   * checked once here, not per event, so a device that can't benefit from
   * it never pays even the listener's cost.
   *
   * El mismo handler también escribe `--hx`/`--hy` (posición normalizada
   * -0.5…0.5): la escena 3D de `HeroShowcaseComponent` los hereda y los
   * usa para rotar/desplazar sus capas a distinta profundidad — un solo
   * listener para la luz y para el 3D, nunca uno por capa.
   */
  private readonly mouseLightEnabled =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private mouseRaf: number | null = null;

  onHeroMouseMove(event: MouseEvent): void {
    if (!this.mouseLightEnabled || this.mouseRaf !== null) {
      return;
    }
    const target = event.currentTarget as HTMLElement;
    this.mouseRaf = requestAnimationFrame(() => {
      this.mouseRaf = null;
      const rect = target.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      target.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      target.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      target.style.setProperty('--hx', (px - 0.5).toFixed(3));
      target.style.setProperty('--hy', (py - 0.5).toFixed(3));
    });
  }

  /** Al salir del Hero, la escena vuelve suavemente a su pose de reposo. */
  onHeroMouseLeave(event: MouseEvent): void {
    if (!this.mouseLightEnabled) {
      return;
    }
    if (this.mouseRaf !== null) {
      cancelAnimationFrame(this.mouseRaf);
      this.mouseRaf = null;
    }
    const target = event.currentTarget as HTMLElement;
    target.style.setProperty('--hx', '0');
    target.style.setProperty('--hy', '0');
  }

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
