import { DashboardNavItem } from '../models';

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: 'Resumen', icon: 'grid', path: '' },
  {
    label: 'Sistema',
    icon: 'briefcase',
    path: 'sistema',
    children: [
      { label: 'Categorías', icon: 'layers', path: 'categorias' },
      { label: 'Negocios', icon: 'shopping-bag', path: 'negocios' },
      { label: 'Proveedores', icon: 'truck', path: 'proveedores' },
      { label: 'Bancos', icon: 'bank', path: 'bancos' },
      { label: 'Tipos de Cuenta', icon: 'layers', path: 'tipos-cuenta' },
      { label: 'Clientes', icon: 'users', path: 'clientes' },
      { label: 'Usuarios', icon: 'users', path: 'usuarios', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'Roles', icon: 'shield-check', path: 'roles', roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'Finanzas',
    icon: 'trending-up',
    path: 'finanzas',
    children: [
      { label: 'Ventas', icon: 'receipt', path: 'ventas' },
      { label: 'Compras', icon: 'arrow-down-circle', path: 'compras' },
      { label: 'Cuentas por Cobrar', icon: 'receipt', path: 'cuentas-por-cobrar' },
      { label: 'Activos', icon: 'package', path: 'activos' },
      { label: 'Recargas Electrónicas', icon: 'smartphone', path: 'recargas' },
      { label: 'Heladería · Inventario', icon: 'gift', path: 'heladeria-inventario' },
      { label: 'Heladería · Compras', icon: 'arrow-down-circle', path: 'heladeria-compras' },
      { label: 'Heladería · Ventas', icon: 'receipt', path: 'heladeria-ventas' },
    ],
  },
  {
    label: 'Reportería',
    icon: 'bar-chart',
    path: 'reportes',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    children: [
      { label: 'Reporte de Ventas', icon: 'receipt', path: 'reportes-ventas' },
      { label: 'Reporte de Compras', icon: 'arrow-down-circle', path: 'reportes-compras' },
      {
        label: 'Reportería de Activos y Cuentas por Cobrar',
        icon: 'receipt',
        path: 'reportes-activos-cuentas-por-cobrar',
      },
      { label: 'Reportería de Heladería', icon: 'gift', path: 'reportes-heladeria' },
      { label: 'Reporte de Recargas', icon: 'smartphone', path: 'reportes-recargas' },
    ],
  },
  {
    label: 'Agentes Bancarios',
    icon: 'bank',
    path: 'agentes-bancarios',
    children: [
      { label: 'Bancos', icon: 'bank', path: 'agentes-bancarios-bancos' },
      { label: 'Cuadre Agentes', icon: 'file-check', path: 'agentes-bancarios-cuadre' },
    ],
  },
  {
    label: 'Librería',
    icon: 'book',
    path: 'libreria',
    children: [{ label: 'Inventario', icon: 'package', path: 'inventario' }],
  },
];
