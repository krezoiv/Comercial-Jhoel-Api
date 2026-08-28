import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

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
        path: 'bancos',
        loadComponent: () =>
          import('./features/dashboard/placeholder-page/dashboard-placeholder-page.component').then(
            (m) => m.DashboardPlaceholderPageComponent
          ),
        data: {
          title: 'Bancos',
          icon: 'bank',
          description: 'Operaciones de agente bancario: depósitos, retiros y pagos. Este módulo está en construcción.',
        },
        title: 'Bancos — Panel',
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
