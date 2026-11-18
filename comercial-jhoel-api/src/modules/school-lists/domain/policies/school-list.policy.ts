import { schoolListError } from '../errors/school-list.errors';

const ALL_OPERATORS = [
  'SUPER_ADMIN',
  'ADMIN',
  'SUPERVISOR_DE_TURNO',
  'USER',
] as const;
const MANAGERS = ['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO'] as const;
const ADMINS = ['SUPER_ADMIN', 'ADMIN'] as const;

/**
 * Permissions of "Listas Escolares" (role-based RBAC, same model as the rest
 * of the system). The SQL functions enforce the same map again with
 * `school_list_assert_permission`, so the database is the final authority.
 */
export const SCHOOL_LIST_PERMISSION_ROLES = {
  /** Consultar plantillas, cotizaciones y el tablero. */
  'school_lists.view': ALL_OPERATORS,
  /** Crear, editar, duplicar, activar y desactivar plantillas. */
  'school_lists.templates.manage': ADMINS,
  /** Crear cotizaciones. */
  'school_lists.quotations.create': ALL_OPERATORS,
  /** Modificar cotizaciones, observaciones, preparar y entregar. */
  'school_lists.quotations.edit': ALL_OPERATORS,
  /** Cambiar el precio de referencia o aplicar descuentos en una línea. */
  'school_lists.prices.override': MANAGERS,
  /** Registrar anticipos y abonos. */
  'school_lists.payments.register': ALL_OPERATORS,
  /** Anular (reversa auditada) un anticipo o abono. */
  'school_lists.payments.void': ADMINS,
  /** Consultar el estado de cuenta de una cotización. */
  'school_lists.statements.view': ALL_OPERATORS,
  /** Asignar a mano unidades a listas, ejecutar FIFO y asignar compras. */
  'school_lists.supply.manage': MANAGERS,
  /** Cancelar cotizaciones (con devolución de lo pagado). */
  'school_lists.quotations.cancel': MANAGERS,
  /** Generar el PDF de la cotización y los comprobantes de pago. */
  'school_lists.documents.generate': ALL_OPERATORS,
} as const;

export type SchoolListPermission = keyof typeof SCHOOL_LIST_PERMISSION_ROLES;

export function hasSchoolListPermission(
  role: string | undefined,
  permission: SchoolListPermission,
): boolean {
  return (
    SCHOOL_LIST_PERMISSION_ROLES[permission] as readonly string[]
  ).includes(role ?? '');
}

/** Throws `SCHOOL_LIST_FORBIDDEN` (403) unless the role holds the permission. */
export function assertSchoolListPermission(
  role: string | undefined,
  permission: SchoolListPermission,
): void {
  if (!hasSchoolListPermission(role, permission)) {
    throw schoolListError('SCHOOL_LIST_FORBIDDEN');
  }
}

/** Every permission the role holds — the frontend shows only these actions. */
export function schoolListPermissionsFor(
  role: string | undefined,
): SchoolListPermission[] {
  return (
    Object.keys(SCHOOL_LIST_PERMISSION_ROLES) as SchoolListPermission[]
  ).filter((permission) => hasSchoolListPermission(role, permission));
}
