import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

import { SITE } from '../../core/data';
import { CatalogService } from '../../core/services/catalog.service';
import { ContactService } from '../../core/services/contact.service';
import { BadgeComponent, ButtonComponent, CardComponent, IconComponent, SectionComponent } from '../../shared/ui';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [AsyncPipe, SectionComponent, CardComponent, BadgeComponent, ButtonComponent, IconComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
  private readonly catalogService = inject(CatalogService);
  private readonly contactService = inject(ContactService);
  readonly site = SITE;
  readonly categories$ = this.catalogService.getCategories();

  /** Real WhatsApp link (`company_settings.whatsapp`) — `null` (button hidden) until the admin configures a real number, never the old hardcoded placeholder. */
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
