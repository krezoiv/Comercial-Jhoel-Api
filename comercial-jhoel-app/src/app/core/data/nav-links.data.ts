import { NavLink } from '../models';

export const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', path: '/', fragment: 'inicio' },
  {
    label: 'Servicios',
    path: '/',
    fragment: 'servicios',
    children: [
      { label: 'Catálogo de Librería', path: '/', fragment: 'libreria', icon: 'book' },
      { label: 'Catálogo de Teléfonos', path: '/', fragment: 'telefonos', icon: 'smartphone' },
      { label: 'Accesorios y Variedades', path: '/', fragment: 'variedades', icon: 'gift' },
      // "Bancos" (catálogo de entidades) y "Agentes bancarios" (la operación
      // que ofrecemos) se fusionaron en una sola sección pública — un solo
      // destino (`agentes-bancarios`), nunca dos entradas para el mismo
      // lugar.
      { label: 'Agentes bancarios', path: '/', fragment: 'agentes-bancarios', icon: 'bank' },
      { label: 'Quiénes somos', path: '/', fragment: 'quienes-somos', icon: 'users', dividerBefore: true },
    ],
  },
  { label: 'Noticias', path: '/', fragment: 'noticias' },
  // Antes apuntaba a la sección de registro por WhatsApp (`noticias-whatsapp`,
  // eliminada) — ahora abre el modal de notificaciones push, ver `action`.
  { label: 'Notificaciones', path: '/', action: 'notifications', icon: 'bell' },
  { label: 'Contacto', path: '/', fragment: 'contacto' },
];

export const NAV_LOGIN_LINK: NavLink = { label: 'Iniciar sesión', path: '/login' };
export const NAV_CTA_LINK: NavLink = { label: 'Ver catálogo', path: '/catalogo', isCta: true };
