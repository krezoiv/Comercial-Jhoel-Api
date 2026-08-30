export type ReportStatusFilter = 'all' | 'active' | 'inactive';

/** Maps the reports module's own `status` query convention to the `isActive` tri-state the Cuentas por Cobrar/Activos repositories expect. */
export function parseReportStatus(status?: ReportStatusFilter): boolean | undefined {
  if (status === 'active') {
    return true;
  }
  if (status === 'inactive') {
    return false;
  }
  return undefined;
}
