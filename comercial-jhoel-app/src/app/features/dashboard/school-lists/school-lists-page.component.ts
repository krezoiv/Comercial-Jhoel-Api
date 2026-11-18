import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SchoolQuotation } from '../../../core/models';
import { SchoolListService } from '../../../core/services/school-list.service';
import { IconComponent } from '../../../shared/ui';
import { SchoolDashboardComponent } from './components/school-dashboard/school-dashboard.component';
import { SchoolQuotationEditorComponent } from './components/school-quotation-editor/school-quotation-editor.component';
import { SchoolQuotationsListComponent } from './components/school-quotations-list/school-quotations-list.component';
import { SchoolTemplatesComponent } from './components/school-templates/school-templates.component';
import { SchoolSupplyComponent } from './components/school-supply/school-supply.component';

export type SchoolListsTab = 'tablero' | 'cotizaciones' | 'nueva' | 'abastecimiento' | 'plantillas';

const TABS: { id: SchoolListsTab; label: string; icon: string }[] = [
  { id: 'tablero', label: 'Tablero', icon: 'grid' },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: 'file-check' },
  { id: 'nueva', label: 'Nueva cotización', icon: 'plus' },
  { id: 'abastecimiento', label: 'Abastecimiento', icon: 'package' },
  { id: 'plantillas', label: 'Plantillas de Listas Escolares', icon: 'book-open' },
];

/**
 * "Cotizaciones de Listas Escolares": header with the main actions (new
 * quotation, supply, templates), then the dashboard, quotation list, new quotation and the
 * official templates per grade. The active tab lives in `?tab=` so a reload or
 * a shared link opens the same view. Actions are shown according to the
 * permissions the backend reports for the user's role.
 */
@Component({
  selector: 'app-school-lists-page',
  standalone: true,
  imports: [
    IconComponent,
    SchoolDashboardComponent,
    SchoolQuotationsListComponent,
    SchoolQuotationEditorComponent,
    SchoolTemplatesComponent,
    SchoolSupplyComponent,
  ],
  templateUrl: './school-lists-page.component.html',
  styleUrl: './school-lists-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolListsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly service = inject(SchoolListService);

  readonly activeTab = signal<SchoolListsTab>('tablero');
  readonly loadError = signal(false);
  /** `?compra=<id>`: open Abastecimiento filtered by that purchase (link from Compras). */
  readonly purchaseId = this.route.snapshot.queryParamMap.get('compra');
  readonly tabs = computed(() =>
    TABS.filter((tab) => tab.id !== 'nueva' || this.service.can('school_lists.quotations.create')),
  );

  constructor() {
    const requested = this.route.snapshot.queryParamMap.get('tab') as SchoolListsTab | null;
    if (requested && TABS.some((tab) => tab.id === requested)) {
      this.activeTab.set(requested);
    }
    this.service.loadPermissions().subscribe({ error: () => this.loadError.set(true) });
  }

  selectTab(tab: SchoolListsTab): void {
    this.activeTab.set(tab);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { tab }, replaceUrl: true });
  }

  onCreated(quotation: SchoolQuotation): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', quotation.id]);
  }
}
