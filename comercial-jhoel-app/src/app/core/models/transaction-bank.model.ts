/** "Banco Agente" — the catalog Transaccionar's bank dropdown reads from. Deliberately separate from `Bank` (Agentes Bancarios/Bancos, coupled to Cuadre de Agentes). */
export interface TransactionBank {
  id: string;
  name: string;
  isActive: boolean;
  /** Logo opcional — el icono del banco en el modal "Selecciona el banco" de Transaccionar. Se sube en Sistema → Banco Agente. */
  hasImage: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload for create/update — the backend assigns id/isActive/timestamps. */
export interface TransactionBankInput {
  name: string;
}
