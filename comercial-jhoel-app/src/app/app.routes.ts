import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing-page.component').then((m) => m.LandingPageComponent),
    title: 'Comercial Jhoel — Librería, Útiles Escolares y Agente Bancario',
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/catalog/catalog-page.component').then((m) => m.CatalogPageComponent),
    title: 'Catálogo — Comercial Jhoel',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login-page.component').then((m) => m.LoginPageComponent),
    title: 'Iniciar sesión — Comercial Jhoel',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/home/dashboard-home.component').then((m) => m.DashboardHomeComponent),
        title: 'Resumen — Panel',
      },
      {
        path: 'sistema',
        loadComponent: () =>
          import('./features/dashboard/placeholder-page/dashboard-placeholder-page.component').then(
            (m) => m.DashboardPlaceholderPageComponent
          ),
        data: {
          title: 'Sistema',
          icon: 'briefcase',
          description: 'Configuración general, usuarios y permisos del panel. Este módulo está en construcción.',
        },
        title: 'Sistema — Panel',
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/dashboard/categories/categories-page.component').then((m) => m.CategoriesPageComponent),
        title: 'Categorías — Panel',
      },
      {
        path: 'negocios',
        loadComponent: () =>
          import('./features/dashboard/businesses/businesses-page.component').then(
            (m) => m.BusinessesPageComponent
          ),
        title: 'Negocios — Panel',
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./features/dashboard/suppliers/suppliers-page.component').then((m) => m.SuppliersPageComponent),
        title: 'Proveedores — Panel',
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/users/users-page.component').then((m) => m.UsersPageComponent),
        title: 'Usuarios — Panel',
      },
      {
        path: 'roles',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/roles/roles-page.component').then((m) => m.RolesPageComponent),
        title: 'Roles — Panel',
      },
      {
        path: 'bancos',
        loadComponent: () =>
          import('./features/dashboard/banks/banks-page.component').then((m) => m.BanksPageComponent),
        title: 'Bancos — Panel',
      },
      {
        path: 'tipos-cuenta',
        loadComponent: () =>
          import('./features/dashboard/account-types/account-types-page.component').then(
            (m) => m.AccountTypesPageComponent
          ),
        title: 'Tipos de Cuenta — Panel',
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/dashboard/clients/clients-page.component').then(
            (m) => m.ClientsPageComponent
          ),
        title: 'Clientes — Panel',
      },
      {
        path: 'finanzas',
        loadComponent: () =>
          import('./features/dashboard/placeholder-page/dashboard-placeholder-page.component').then(
            (m) => m.DashboardPlaceholderPageComponent
          ),
        data: {
          title: 'Finanzas',
          icon: 'trending-up',
          description: 'Ingresos, egresos y reportes financieros del negocio. Este módulo está en construcción.',
        },
        title: 'Finanzas — Panel',
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./features/dashboard/sales/sales-page.component').then((m) => m.SalesPageComponent),
        title: 'Ventas — Panel',
      },
      {
        path: 'compras',
        loadComponent: () =>
          import('./features/dashboard/purchases/purchases-page.component').then((m) => m.PurchasesPageComponent),
        title: 'Compras — Panel',
      },
      {
        path: 'recargas',
        loadComponent: () =>
          import('./features/dashboard/recharges/recharges-page.component').then((m) => m.RechargesPageComponent),
        title: 'Recargas Electrónicas — Panel',
      },
      {
        path: 'cuentas-por-cobrar',
        loadComponent: () =>
          import('./features/dashboard/accounts-receivable/accounts-receivable-page.component').then(
            (m) => m.AccountsReceivablePageComponent
          ),
        title: 'Cuentas por Cobrar — Panel',
      },
      {
        path: 'activos',
        loadComponent: () =>
          import('./features/dashboard/assets/assets-page.component').then((m) => m.AssetsPageComponent),
        title: 'Activos — Panel',
      },
      {
        path: 'heladeria-inventario',
        loadComponent: () =>
          import('./features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component').then(
            (m) => m.IceCreamInventoryPageComponent
          ),
        title: 'Heladería · Inventario — Panel',
      },
      {
        path: 'heladeria-compras',
        loadComponent: () =>
          import('./features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component').then(
            (m) => m.IceCreamPurchasesPageComponent
          ),
        title: 'Heladería · Compras — Panel',
      },
      {
        path: 'heladeria-ventas',
        loadComponent: () =>
          import('./features/dashboard/ice-creams/sales/ice-cream-sales-page.component').then(
            (m) => m.IceCreamSalesPageComponent
          ),
        title: 'Heladería · Ventas — Panel',
      },
      {
        path: 'reportes',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/placeholder-page/dashboard-placeholder-page.component').then(
            (m) => m.DashboardPlaceholderPageComponent
          ),
        data: {
          title: 'Reportería',
          icon: 'bar-chart',
          description: 'Selecciona un reporte del menú para consultar, filtrar y exportar la información.',
        },
        title: 'Reportería — Panel',
      },
      {
        path: 'reportes-ventas',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/reports/sales/sales-report-page.component').then(
            (m) => m.SalesReportPageComponent
          ),
        title: 'Reporte de Ventas — Panel',
      },
      {
        path: 'reportes-compras',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/reports/purchases/purchases-report-page.component').then(
            (m) => m.PurchasesReportPageComponent
          ),
        title: 'Reporte de Compras — Panel',
      },
      {
        path: 'reportes-activos-cuentas-por-cobrar',
        canActivate: [adminGuard],
        loadComponent: () =>
          import(
            './features/dashboard/reports/assets-receivables/assets-receivables-report-page.component'
          ).then((m) => m.AssetsReceivablesReportPageComponent),
        title: 'Reportería de Activos y Cuentas por Cobrar — Panel',
      },
      {
        path: 'reportes-recargas',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/reports/recharges/recharges-report-page.component').then(
            (m) => m.RechargesReportPageComponent
          ),
        title: 'Reporte de Recargas Electrónicas — Panel',
      },
      {
        path: 'reportes-heladeria',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/reports/ice-cream/ice-cream-report-page.component').then(
            (m) => m.IceCreamReportPageComponent
          ),
        title: 'Reportería de Heladería — Panel',
      },
      {
        path: 'agentes-bancarios-bancos',
        loadComponent: () =>
          import('./features/dashboard/bank-agents/bank-agents-page.component').then(
            (m) => m.BankAgentsPageComponent
          ),
        title: 'Agentes Bancarios — Panel',
      },
      {
        path: 'agentes-bancarios-cuadre',
        loadComponent: () =>
          import('./features/dashboard/bank-agents/cuadre-agentes-page.component').then(
            (m) => m.CuadreAgentesPageComponent
          ),
        title: 'Cuadre Agentes — Panel',
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./features/dashboard/inventory/inventory-page.component').then((m) => m.InventoryPageComponent),
        title: 'Inventario — Panel',
      },
      {
        path: 'libreria',
        loadComponent: () =>
          import('./features/dashboard/placeholder-page/dashboard-placeholder-page.component').then(
            (m) => m.DashboardPlaceholderPageComponent
          ),
        data: {
          title: 'Librería',
          icon: 'book',
          description: 'Catálogo de productos, inventario y ventas de la librería. Este módulo está en construcción.',
        },
        title: 'Librería — Panel',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
