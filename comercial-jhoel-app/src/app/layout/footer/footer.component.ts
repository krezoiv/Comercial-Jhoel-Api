import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { NAV_LINKS, SITE } from '../../core/data';
import { ContactChannel, SocialLink } from '../../core/models';
import { ContactService } from '../../core/services/contact.service';
import { SiteVisitsService } from '../../core/services/site-visits.service';
import { formatQuantity } from '../../core/utils/number-format.util';
import { ContainerComponent, IconComponent } from '../../shared/ui';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ContainerComponent, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly contactService = inject(ContactService);
  private readonly siteVisitsService = inject(SiteVisitsService);

  readonly site = SITE;
  // "Notificaciones" es un botón que abre un modal desde el Navbar — el
  // Footer solo renderiza <a routerLink>, así que nunca tendría a dónde
  // navegar; se excluye aquí en vez de intentar reproducir la lógica del
  // modal en un segundo lugar.
  readonly navLinks = NAV_LINKS.filter((link) => !link.action);
  readonly year = new Date().getFullYear();
  readonly formatQuantity = formatQuantity;

  /** Datos reales de la empresa (`company_settings`, vía `/company-info` público) — nunca hardcodeados. Si la petición falla, estas columnas simplemente quedan vacías; el resto del footer sigue funcionando. */
  readonly channels = signal<ContactChannel[]>([]);
  readonly socialLinks = signal<SocialLink[]>([]);
  readonly businessHours = signal<string | null>(null);

  /** Contador agregado y anónimo — backend puro, ver `SiteVisitsService`. `null` mientras carga o si la petición falla (la columna simplemente no aparece, nunca un "0" falso). */
  readonly visitCount = signal<number | null>(null);

  constructor() {
    this.contactService
      .getContactInfo()
      .pipe(catchError(() => of(null)))
      .subscribe((info) => {
        if (!info) {
          return;
        }
        this.channels.set(info.channels);
        this.socialLinks.set(info.socialLinks);
        this.businessHours.set(info.businessHours);
      });

    this.siteVisitsService
      .getVisitCount()
      .pipe(catchError(() => of(null)))
      .subscribe((count) => {
        if (count) {
          this.visitCount.set(count.total);
        }
      });
  }
}
