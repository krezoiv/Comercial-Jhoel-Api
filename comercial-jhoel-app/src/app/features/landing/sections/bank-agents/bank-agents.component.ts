import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

import { SITE } from '../../../../core/data';
import { BankAgentService } from '../../../../core/services/bank-agent.service';
import { ContactService } from '../../../../core/services/contact.service';
import {
  ButtonComponent,
  CardComponent,
  IconComponent,
  SectionComponent,
  SectionHeadingComponent,
} from '../../../../shared/ui';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { CatalogBanksComponent } from '../catalog-banks/catalog-banks.component';
import { SectionLandingBackgroundComponent } from '../shared/section-landing-background/section-landing-background.component';

/**
 * "Agentes Bancarios" — sección pública única que fusiona lo que antes
 * eran dos secciones separadas: esta misma (la oferta de servicio propio
 * como agente bancario) y "Bancos" (el catálogo de entidades con las que
 * se trabaja, `CatalogBanksComponent`, embebido abajo sin su propio
 * `<app-section>`/anchor). Un solo destino de navegación
 * (`agentes-bancarios`) para ambos conceptos — nunca dos anchors para
 * contenido relacionado. Nada financiero interno (saldos, cuentas,
 * cuadre) aparece aquí ni apareció nunca: ambas fuentes ya eran
 * exclusivamente de cara al público antes de la fusión.
 */
@Component({
  selector: 'app-bank-agents',
  standalone: true,
  imports: [
    AsyncPipe,
    SectionComponent,
    SectionHeadingComponent,
    CardComponent,
    ButtonComponent,
    IconComponent,
    RevealOnScrollDirective,
    CatalogBanksComponent,
    SectionLandingBackgroundComponent,
  ],
  templateUrl: './bank-agents.component.html',
  styleUrl: './bank-agents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAgentsComponent {
  private readonly bankAgentService = inject(BankAgentService);
  private readonly contactService = inject(ContactService);
  readonly site = SITE;
  readonly operations$ = this.bankAgentService.getOperations();
  readonly trustPoints$ = this.bankAgentService.getTrustPoints();

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
