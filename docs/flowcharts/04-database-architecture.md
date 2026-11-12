# 04 · Arquitectura de la base de datos: escritores únicos, ledgers y triggers

Módulo: **Base de datos** · Fuente editable: [`04-database-architecture.mmd`](04-database-architecture.mmd) · [Índice de diagramas](README.md)

```mermaid
flowchart LR
  subgraph ORIG["Operaciones de negocio (tablas origen)"]
    BDO[("bank_deposit_operations<br/>Transaccionar")]
    AR[("accounts_receivable<br/>CxC")]
    AS[("assets<br/>Activos")]
    BAM[("bank_account_movements<br/>ledger bancario")]
    DO[("day_openings<br/>día de Agentes Bancarios")]
  end
  subgraph WRITERS["Escritores únicos (funciones)"]
    ABM[["apply_bank_account_movement()"]]
    ACM[["apply_cash_movement()<br/>lock cash_control_main"]]
    AWM[["apply_warehouse_cash_movement()<br/>lock warehouse_cash_main"]]
    AGM[["apply_guayacan_cash_movement()"]]
  end
  subgraph LEDGERS["Saldos (Kardex / ledgers)"]
    BK[("banks.final_balance<br/>+ bank_account_movements")]
    CM[("cash_movements<br/>cash_balance()")]
    WM[("warehouse_cash_movements<br/>warehouse_cash_balance()")]
    GM[("guayacan_cash_movements<br/>guayacan_cash_balance()")]
  end
  subgraph TRIG["Triggers"]
    T1["trg_cash_bank_deposit_insert / _void<br/>cash_on_bank_deposit_insert()"]
    T2["trg_cash_accounts_receivable_* · trg_cash_assets_*<br/>cash_on_portfolio_row()"]
    T3["trg_cash_bank_movement_insert / _void<br/>cash_on_bank_movement_insert()"]
    T4["trg_guayacan_commission_insert / _void<br/>guayacan_commission_on_operation_insert()"]
    T5["trg_cash_bank_day_on_opening<br/>cash_bank_day_on_opening() → cash_bank_day_openings"]
    T6["trg_*_guard → cash_custody_status_only_guard()<br/>inmutabilidad (arqueos, Bodega, fotos del cuadre)"]
    T7["trg_financial_review_guard → financial_review_day_guard()<br/>días en revisión"]
  end
  ABM --> BK
  ACM --> CM
  AWM --> WM
  AGM --> GM
  BDO --> T1 -->|"dirección = transaction_types.cash_effect<br/>(Guayacán = NONE)"| ACM
  BDO --> T4 --> AGM
  AR --> T2 -->|"ABONO = IN · CARGO = OUT"| ACM
  AS --> T2
  T2 -->|"Activos: CARGO = IN · ABONO = OUT"| ACM
  BAM --> T3 -->|"RETIRO_EFECTIVO = RETIRO_BANCARIO IN"| ACM
  DO --> T5
  T6 -.-> WM
  T7 -.-> BDO
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
  classDef dom fill:#fff8e1,stroke:#f9a825,color:#5d4037
  class BDO,AR,AS,BAM,DO,BK,CM,WM,GM db
  class ABM,ACM,AWM,AGM infra
  class T1,T2,T3,T4,T5,T6,T7 dom
```

## Explicación

1. **¿Qué proceso representa?** Qué función PL/pgSQL es la única que escribe cada saldo (banco, caja, Bodega, Guayacán), qué triggers convierten operaciones de otros módulos en movimientos de efectivo y qué guards protegen la inmutabilidad y la revisión de días.
2. **¿Dónde comienza?** Una función de registro llamada desde un repositorio (SELECT register_…(...))
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations/1760005100000-CreateBankAccountMovements.ts`](../../comercial-jhoel-api/src/database/migrations/1760005100000-CreateBankAccountMovements.ts), [`comercial-jhoel-api/src/database/migrations/1760006800000-CreateCashControlKardexAndCuts.ts`](../../comercial-jhoel-api/src/database/migrations/1760006800000-CreateCashControlKardexAndCuts.ts), [`comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts`](../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts), [`comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts`](../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts), [`comercial-jhoel-api/src/database/migrations/1760006300000-CreateGuayacanCashBox.ts`](../../comercial-jhoel-api/src/database/migrations/1760006300000-CreateGuayacanCashBox.ts), [`comercial-jhoel-api/src/database/migrations/1760007100000-FinancialDayReview.ts`](../../comercial-jhoel-api/src/database/migrations/1760007100000-FinancialDayReview.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Cada escritor bloquea (FOR UPDATE o pg_advisory_xact_lock) y valida antes de escribir; los triggers deciden la dirección (IN/OUT/NONE) según el tipo de movimiento
6. **¿Dónde se almacenan los datos?** banks.final_balance + bank_account_movements · cash_movements · warehouse_cash_movements · guayacan_cash_movements
7. **¿Cómo termina el proceso?** COMMIT de la transacción de la función que inició la operación
8. **¿Qué sucede cuando ocurre un error?** Un RAISE EXCEPTION en cualquier escritor o trigger revierte toda la operación; trg_*_guard rechaza UPDATE/DELETE en tablas inmutables; trg_financial_review_guard bloquea días en revisión

> Diagrama escrito a mano a partir del código; ver la sección de archivos.
