import { DashboardNavItem } from '../models';

const ADMIN_ONLY = ['SUPER_ADMIN', 'ADMIN'];

/**
 * Sidebar clasificado por tipo. Un grupo (`children`) nunca es una ruta: su
 * `path` es solo un identificador único (los grupos/subgrupos nuevos usan el
 * prefijo `grupo-`). Se permite un segundo nivel de submenús (p. ej.
 * Sistema → Bancos y Transacciones → Tipos de Cuenta). Todas las rutas hoja y
 * sus `roles` son exactamente las de siempre — solo cambió dónde viven en el
 * menú.
 */
export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: 'Resumen', icon: 'grid', path: '' },
  {
    label: 'Ventas y Compras',
    icon: 'shopping-bag',
    path: 'grupo-ventas-compras',
    children: [
      { label: 'Ventas', icon: 'receipt', path: 'ventas' },
      { label: 'Compras', icon: 'arrow-down-circle', path: 'compras' },
      { label: 'Tickets', icon: 'tag', path: 'tickets' },
      { label: 'Cotizaciones', icon: 'file-check', path: 'cotizaciones' },
    ],
  },
  {
    label: 'Agentes Bancarios',
    icon: 'bank',
    path: 'agentes-bancarios',
    children: [
      { label: 'Transaccionar', icon: 'bank', path: 'transaccionar' },
      { label: 'Transferencias Bancarias', icon: 'arrow-left-right', path: 'transferencias-bancarias' },
      { label: 'Bancos', icon: 'wallet', path: 'agentes-bancarios-bancos' },
      { label: 'Cuadre Agentes', icon: 'file-check', path: 'agentes-bancarios-cuadre' },
    ],
  },
  { label: 'Recargas Electrónicas', icon: 'smartphone', path: 'recargas' },
  {
    label: 'Cartera',
    icon: 'wallet',
    path: 'grupo-cartera',
    children: [
      { label: 'Cuentas por Cobrar', icon: 'receipt', path: 'cuentas-por-cobrar' },
      { label: 'Activos', icon: 'package', path: 'activos' },
    ],
  },
  {
    label: 'Inventario',
    icon: 'package',
    path: 'grupo-inventario',
    children: [
      { label: 'Inventario General', icon: 'package', path: 'inventario' },
      { label: 'Librería', icon: 'book', path: 'libreria' },
      { label: 'Heladería · Inventario', icon: 'gift', path: 'heladeria-inventario' },
      {
        label: 'Teléfonos',
        icon: 'smartphone',
        path: 'telefonos',
        children: [
          { label: 'Inventario', icon: 'package', path: 'telefonos-inventario' },
          { label: 'Compras', icon: 'arrow-down-circle', path: 'telefonos-compras' },
          { label: 'Ventas', icon: 'shopping-bag', path: 'telefonos-ventas' },
        ],
      },
    ],
  },
  {
    label: 'Reportes y Gráficas',
    icon: 'bar-chart',
    path: 'grupo-reportes-graficas',
    roles: ADMIN_ONLY,
    children: [
      {
        label: 'Reportes',
        icon: 'file-check',
        path: 'reportes',
        children: [
          { label: 'Ventas', icon: 'receipt', path: 'reportes-ventas' },
          { label: 'Compras', icon: 'arrow-down-circle', path: 'reportes-compras' },
          { label: 'Activos y Cuentas por Cobrar', icon: 'receipt', path: 'reportes-activos-cuentas-por-cobrar' },
          { label: 'Heladería', icon: 'gift', path: 'reportes-heladeria' },
          { label: 'Recargas', icon: 'smartphone', path: 'reportes-recargas' },
          { label: 'Transacciones', icon: 'bank', path: 'reportes-transacciones' },
          { label: 'Transferencias Bancarias', icon: 'arrow-left-right', path: 'reportes-transferencias' },
          { label: 'Movimientos Bancarios', icon: 'layers', path: 'reportes-movimientos-bancarios' },
          { label: 'Cuadre de Agentes', icon: 'file-check', path: 'reportes-cuadre-agentes' },
        ],
      },
      {
        label: 'Gráficas',
        icon: 'trending-up',
        path: 'graficas',
        children: [
          { label: 'Indicadores de Ventas', icon: 'receipt', path: 'graficas-indicadores-ventas' },
          { label: 'Indicadores de Compras', icon: 'arrow-down-circle', path: 'graficas-indicadores-compras' },
          { label: 'Indicadores de Recargas', icon: 'smartphone', path: 'graficas-indicadores-recargas' },
          { label: 'Indicadores de Transacciones', icon: 'trending-up', path: 'graficas-indicadores-transacciones' },
        ],
      },
    ],
  },
  {
    label: 'Sistema',
    icon: 'briefcase',
    path: 'sistema',
    children: [
      {
        label: 'Catálogos Generales',
        icon: 'layers',
        path: 'grupo-sistema-catalogos',
        children: [
          { label: 'Categorías', icon: 'layers', path: 'categorias' },
          { label: 'Negocios', icon: 'shopping-bag', path: 'negocios' },
          { label: 'Proveedores', icon: 'truck', path: 'proveedores' },
          { label: 'Clientes', icon: 'users', path: 'clientes' },
          { label: 'Presentaciones y Medidas', icon: 'layers', path: 'presentaciones-medidas' },
        ],
      },
      {
        label: 'Bancos y Transacciones',
        icon: 'bank',
        path: 'grupo-sistema-bancos',
        children: [
          { label: 'Bancos', icon: 'bank', path: 'bancos' },
          { label: 'Tipos de Cuenta', icon: 'layers', path: 'tipos-cuenta' },
          { label: 'Banco Agente', icon: 'bank', path: 'banco-agente' },
          { label: 'Tipo de Transacción', icon: 'arrow-left-right', path: 'tipo-transaccion' },
        ],
      },
      {
        label: 'Cajas y Cierres',
        icon: 'lock',
        path: 'grupo-sistema-cajas',
        children: [
          { label: 'Gestión Caja Recargas', icon: 'wallet', path: 'gestion-caja-recargas' },
          { label: 'Gestión de Caja de Ventas', icon: 'receipt', path: 'gestion-caja-ventas' },
          { label: 'Gestión de Días Cerrados', icon: 'lock', path: 'gestion-dias-cerrados', roles: ADMIN_ONLY },
          { label: 'Gestión de Días de Recargas', icon: 'lock', path: 'gestion-dias-recargas', roles: ADMIN_ONLY },
          { label: 'Gestión de Transacciones', icon: 'lock', path: 'gestion-transacciones', roles: ADMIN_ONLY },
        ],
      },
      {
        label: 'Administrar Facturas',
        icon: 'file-check',
        path: 'grupo-sistema-facturas',
        roles: ADMIN_ONLY,
        children: [
          { label: 'Facturas de Compras', icon: 'shopping-bag', path: 'administrar-facturas-compras' },
          { label: 'Facturas de Ventas', icon: 'file-check', path: 'administrar-facturas-ventas' },
          { label: 'Ventas de SIM', icon: 'shield-check', path: 'administrar-ventas-sim' },
        ],
      },
      {
        label: 'Catálogo Web',
        icon: 'globe',
        path: 'grupo-sistema-catalogo-web',
        roles: ADMIN_ONLY,
        children: [
          { label: 'Catálogo de Teléfonos', icon: 'smartphone', path: 'catalogo-telefonos' },
          { label: 'Solicitudes del Catálogo', icon: 'shopping-bag', path: 'catalogo-solicitudes' },
          { label: 'Catálogo de Librería', icon: 'book', path: 'catalogo-libreria' },
          { label: 'Variedades y Accesorios', icon: 'gift', path: 'catalogo-variedades' },
          { label: 'Solicitudes de Variedades', icon: 'shopping-bag', path: 'catalogo-variedades-solicitudes' },
          { label: 'Catálogo de Bancos', icon: 'bank', path: 'catalogo-bancos' },
          { label: 'Fondos de Landing', icon: 'layers', path: 'fondos-landing' },
        ],
      },
      {
        label: 'Noticias',
        icon: 'newspaper',
        path: 'grupo-sistema-noticias',
        children: [
          { label: 'Noticias', icon: 'newspaper', path: 'noticias', roles: ADMIN_ONLY },
          { label: 'Tipos de Noticias', icon: 'tag', path: 'tipos-noticias' },
          { label: 'Suscriptores', icon: 'bell', path: 'suscriptores-noticias', roles: ADMIN_ONLY },
        ],
      },
      {
        label: 'Usuarios y Configuración',
        icon: 'users',
        path: 'grupo-sistema-configuracion',
        roles: ADMIN_ONLY,
        children: [
          { label: 'Usuarios', icon: 'users', path: 'usuarios' },
          { label: 'Roles', icon: 'shield-check', path: 'roles' },
          { label: 'Configuración de Empresa', icon: 'briefcase', path: 'configuracion-empresa' },
          { label: 'Configuración de Alertas', icon: 'bell', path: 'configuracion-alertas' },
          { label: 'Atajos de Teclado', icon: 'keyboard', path: 'atajos-teclado' },
        ],
      },
    ],
  },
];
