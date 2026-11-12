# Efectivo — entradas, salidas y transferencias internas entre caja, Bodega y bancos

Módulo: **Control de Efectivo (cash-control) · Bancos · CxC · Activos** · Fuente editable: [`cash-custody-movements.mmd`](cash-custody-movements.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph IN_["Entradas reales a caja (IN)"]
    I1["Transaccionar con cash_effect = IN<br/>(ej. Depósito, Pago Génesis)<br/>cash_on_bank_deposit_insert"]
    I2["Abono de CxC en efectivo<br/>ABONO_POR_COBRAR · cash_on_portfolio_row"]
    I3["Registro de Activo (CARGO)<br/>ACTIVO · cash_on_portfolio_row"]
    I4["Retiro de efectivo en banco<br/>RETIRO_BANCARIO · cash_on_bank_movement_insert"]
    I5["Entrada manual / SALDO_INICIAL / AJUSTE<br/>register_manual_cash_movement"]
  end
  subgraph OUT_["Salidas reales de caja (OUT)"]
    O1["Transaccionar con cash_effect = OUT<br/>(ej. Retiro, Desembolso Génesis)"]
    O2["Cargo de CxC (gasto por cobrar)<br/>GASTO_POR_COBRAR"]
    O3["Abono de Activo<br/>DEVOLUCION_ACTIVO"]
    O4["Salida manual<br/>register_manual_cash_movement"]
  end
  CAJA[("Caja<br/>cash_movements")]
  BOD[("Bodega<br/>warehouse_cash_movements")]
  BANK[("Cuenta bancaria<br/>banks + bank_account_movements")]
  I1 --> CAJA
  I2 --> CAJA
  I3 --> CAJA
  I4 --> CAJA
  I5 --> CAJA
  CAJA --> O1
  CAJA --> O2
  CAJA --> O3
  CAJA --> O4
  CAJA -->|"Entrega a Bodega (interna)<br/>register_cash_warehouse_transfer:<br/>caja ENTREGA_BODEGA OUT + Bodega ENTREGA_DESDE_CAJA IN"| BOD
  BOD -->|"Retiro de Bodega a CAJA (interna)<br/>register_warehouse_withdrawal:<br/>Bodega DEVOLUCION_A_CAJA OUT + caja DEVOLUCION_BODEGA IN"| CAJA
  BOD -->|"Retiro de Bodega a BANCO<br/>Bodega DEPOSITO_BANCARIO OUT + banco DEPOSITO_CAJA +"| BANK
  CAJA -->|"Depósito de caja a banco<br/>register_cash_bank_deposit:<br/>caja DEPOSITO_BANCARIO OUT + banco DEPOSITO_CAJA +"| BANK
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef ok fill:#e8f5e9,stroke:#1b5e20,color:#1b5e20
  classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c
  class CAJA,BOD,BANK db
  class I1,I2,I3,I4,I5 ok
  class O1,O2,O3,O4 err
```

## Explicación

1. **¿Qué proceso representa?** Qué operación escribe cada movimiento del Kardex de caja (cash_movements) y del Kardex de Bodega (warehouse_cash_movements), y cuáles son transferencias internas (no cambian el total bajo custodia caja + Bodega) frente a entradas o salidas reales.
2. **¿Dónde comienza?** Cualquier operación que mueve efectivo físico
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations/1760006800000-CreateCashControlKardexAndCuts.ts`](../../../../comercial-jhoel-api/src/database/migrations/1760006800000-CreateCashControlKardexAndCuts.ts), [`comercial-jhoel-api/src/database/migrations/1760006900000-CashBankDeposit.ts`](../../../../comercial-jhoel-api/src/database/migrations/1760006900000-CashBankDeposit.ts), [`comercial-jhoel-api/src/database/migrations/1760007000000-AccountsReceivableSettlements.ts`](../../../../comercial-jhoel-api/src/database/migrations/1760007000000-AccountsReceivableSettlements.ts), [`comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts`](../../../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts), [`comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts`](../../../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** CxC: ¿ABONO? → IN (ABONO_POR_COBRAR), si no OUT (GASTO_POR_COBRAR); un ABONO de una cancelación por DEPOSITO_BANCARIO no toca caja · Activos: ¿ABONO? → OUT (DEVOLUCION_ACTIVO), si no IN (ACTIVO) · Retiro de Bodega: ¿destino CAJA o BANCO?
6. **¿Dónde se almacenan los datos?** cash_movements (cash_balance()), warehouse_cash_movements (warehouse_cash_balance()), banks.final_balance + bank_account_movements
7. **¿Cómo termina el proceso?** Cada flecha es un movimiento escrito por apply_cash_movement / apply_warehouse_cash_movement / apply_bank_account_movement dentro de la misma transacción de la operación
8. **¿Qué sucede cuando ocurre un error?** CASH_INSUFFICIENT_BALANCE (caja), WAREHOUSE_INSUFFICIENT_BALANCE (Bodega), reglas bancarias; los arqueos (register_cash_count) solo toman una foto y nunca mueven saldo

> Diagrama escrito a mano a partir del código; ver la sección de archivos.
