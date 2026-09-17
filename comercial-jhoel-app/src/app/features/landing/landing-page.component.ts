import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class LandingPageComponent {}
