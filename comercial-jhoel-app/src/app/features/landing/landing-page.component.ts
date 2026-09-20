import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

import { SiteVisitsService } from '../../core/services/site-visits.service';
import { HeroComponent } from './sections/hero/hero.component';
import { CredibilityComponent } from './sections/credibility/credibility.component';
import { ServicesComponent } from './sections/services/services.component';
import { PhonesComponent } from './sections/phones/phones.component';
import { LibraryCatalogComponent } from './sections/library-catalog/library-catalog.component';
import { VarietiesCatalogComponent } from './sections/varieties-catalog/varieties-catalog.component';
import { NewsComponent } from './sections/news/news.component';
import { CatalogPreviewComponent } from './sections/catalog-preview/catalog-preview.component';
import { BankAgentsComponent } from './sections/bank-agents/bank-agents.component';
import { AboutComponent } from './sections/about/about.component';
import { ContactComponent } from './sections/contact/contact.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroComponent,
    CredibilityComponent,
    ServicesComponent,
    PhonesComponent,
    LibraryCatalogComponent,
    VarietiesCatalogComponent,
    NewsComponent,
    CatalogPreviewComponent,
    BankAgentsComponent,
    AboutComponent,
    ContactComponent,
  ],
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  private readonly siteVisitsService = inject(SiteVisitsService);

  /**
   * Se registra UNA vez por carga real de esta página — el constructor solo
   * corre cuando Angular Router navega A la ruta `/` (una entrada nueva, un
   * refresh, o volver después de haber salido a otra ruta como `/login`);
   * desplazarse entre anchors (`#noticias`, `#contacto`, ...) es la MISMA
   * instancia de este componente y nunca vuelve a ejecutar el constructor,
   * así que nunca duplica una visita por navegación interna. Sin
   * localStorage/sessionStorage/cookies — el backend es la única fuente de
   * verdad (ver `SiteVisitsService`).
   */
  constructor() {
    this.siteVisitsService
      .registerVisit()
      .pipe(catchError(() => of(null)))
      .subscribe();
  }
}
