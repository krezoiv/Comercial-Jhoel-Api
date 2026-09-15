import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { NAV_LINKS, SITE } from '../../core/data';
import { ContactChannel, SocialLink } from '../../core/models';
import { ContactService } from '../../core/services/contact.service';
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

  readonly site = SITE;
  readonly navLinks = NAV_LINKS;
  readonly year = new Date().getFullYear();

  /** Datos reales de la empresa (`company_settings`, vía `/company-info` público) — nunca hardcodeados. Si la petición falla, estas columnas simplemente quedan vacías; el resto del footer sigue funcionando. */
  readonly channels = signal<ContactChannel[]>([]);
  readonly socialLinks = signal<SocialLink[]>([]);
  readonly businessHours = signal<string | null>(null);
  readonly address = signal<string | null>(null);

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
        this.address.set(info.address);
      });
  }
}
