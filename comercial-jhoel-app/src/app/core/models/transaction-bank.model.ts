/** "Banco Agente" — the catalog Transaccionar's bank dropdown reads from. Deliberately separate from `Bank` (Agentes Bancarios/Bancos, coupled to Cuadre de Agentes). */
export interface TransactionBank {
  id: string;
  name: string;
  isActive: boolean;
  /** Logo opcional — el icono del banco en el modal "Selecciona el banco" de Transaccionar. Se sube en Sistema → Banco Agente. */
  hasImage: boolean;
  /** 'GUAYACAN' = Cooperativa Guayacán: caja propia (Cuadre de Caja Guayacán) y comisión por transacción. `null` en cualquier otro banco agente. */
  cashBoxCode: 'GUAYACAN' | null;
  /** Comisión vigente por transacción individual — solo con `cashBoxCode`. Se configura aquí (Sistema → Banco Agente); nunca se repite en componentes. */
  commissionPerTransaction: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload for create/update — the backend assigns id/isActive/timestamps. */
export interface TransactionBankInput {
  name: string;
  /** Solo en edición (admin): marca/desmarca Cooperativa Guayacán. */
  isGuayacan?: boolean;
  commissionPerTransaction?: number;
}
