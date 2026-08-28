import { DashboardNavItem } from '../models';

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: 'Resumen', icon: 'grid', path: '' },
  { label: 'Sistema', icon: 'briefcase', path: 'sistema' },
  { label: 'Finanzas', icon: 'trending-up', path: 'finanzas' },
  { label: 'Bancos', icon: 'bank', path: 'bancos' },
  {
    label: 'Librería',
    icon: 'book',
    path: 'libreria',
    children: [{ label: 'Inventario', icon: 'package', path: 'inventario' }],
  },
];
