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
      { label: 'Bancos', path: '/', fragment: 'bancos', icon: 'bank' },
      { label: 'Quiénes somos', path: '/', fragment: 'quienes-somos', icon: 'users', dividerBefore: true },
      { label: 'Agentes bancarios', path: '/', fragment: 'agentes-bancarios', icon: 'bank' },
    ],
  },
  { label: 'Noticias', path: '/', fragment: 'noticias' },
  { label: 'Regístrate', path: '/', fragment: 'noticias-whatsapp' },
  { label: 'Contacto', path: '/', fragment: 'contacto' },
];

export const NAV_LOGIN_LINK: NavLink = { label: 'Iniciar sesión', path: '/login' };
export const NAV_CTA_LINK: NavLink = { label: 'Ver catálogo', path: '/catalogo', isCta: true };
