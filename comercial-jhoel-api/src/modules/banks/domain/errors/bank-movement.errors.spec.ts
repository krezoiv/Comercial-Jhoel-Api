import {
  BankAccountRequiredError,
  ReintegroSourceIsGenesisError,
  BankBalanceLimitExceededError,
  CreditLineLimitExceededError,
  CreditLineNoDebtError,
  CreditLineOverpaymentError,
  InsufficientBankBalanceError,
  LegacyCreditLineTransferError,
  InvalidMovementAmountError,
  SameAccountTransferError,
  TransferOriginNotAllowedError,
  bankMovementErrorFromMessage,
} from './bank-movement.errors';

describe('bankMovementErrorFromMessage', () => {
  it('maps an insufficient deposit balance to the exact business message', () => {
    const error = bankMovementErrorFromMessage('INSUFFICIENT_BALANCE:DEPOSITO');
    expect(error).toBeInstanceOf(InsufficientBankBalanceError);
    expect(error?.message).toBe(
      'Saldo insuficiente para realizar el depósito.',
    );
    expect((error as InsufficientBankBalanceError).status).toBe(400);
  });

  it('maps an insufficient transfer balance', () => {
    expect(
      bankMovementErrorFromMessage('INSUFFICIENT_BALANCE:TRANSFERENCIA_SALIDA')
        ?.message,
    ).toBe('Saldo insuficiente para realizar la transferencia.');
  });

  it('maps the Génesis payment limit using the configured value', () => {
    const error = bankMovementErrorFromMessage(
      'BALANCE_LIMIT_EXCEEDED:PAGO_GENESIS:GENESIS:120000.00:Fundación Génesis Empresarial',
    );
    expect(error).toBeInstanceOf(BankBalanceLimitExceededError);
    expect(error?.message).toBe(
      'El pago excede el límite máximo permitido de Q120,000.00 para la línea de crédito de Fundación Génesis Empresarial.',
    );
  });

  it('maps the BI Club limit using the configured value', () => {
    expect(
      bankMovementErrorFromMessage(
        'BALANCE_LIMIT_EXCEEDED:TRANSFERENCIA_ENTRADA:BI_CLUB:75000.00:Bi Club Empresarial',
      )?.message,
    ).toBe(
      'El saldo de BI Club Empresarial no puede superar el límite configurado de Q75,000.00.',
    );
  });

  it('keeps a bank name containing ":" intact for a generic limit', () => {
    expect(
      bankMovementErrorFromMessage(
        'BALANCE_LIMIT_EXCEEDED:RETIRO::500.00:Cuenta: especial',
      )?.message,
    ).toBe(
      'El saldo de Cuenta: especial no puede superar el límite configurado de Q500.00.',
    );
  });

  it('maps the special transfer-origin rules', () => {
    const biClub = bankMovementErrorFromMessage(
      'TRANSFER_ORIGIN_NOT_ALLOWED:BI_CLUB',
    );
    const districol = bankMovementErrorFromMessage(
      'TRANSFER_ORIGIN_NOT_ALLOWED:DISTRICOL',
    );
    expect(biClub).toBeInstanceOf(TransferOriginNotAllowedError);
    expect(biClub?.message).toBe(
      'Solo Banco Industrial puede transferir a BI Club Empresarial.',
    );
    expect(districol?.message).toBe(
      'Solo Banco Agromercantil puede transferir a Districol.',
    );
  });

  it('maps amount / same-account / missing-account codes', () => {
    expect(
      bankMovementErrorFromMessage('INVALID_MOVEMENT_AMOUNT:x'),
    ).toBeInstanceOf(InvalidMovementAmountError);
    expect(
      bankMovementErrorFromMessage('INVALID_MOVEMENT_AMOUNT:x')?.message,
    ).toBe('El monto debe ser mayor que cero.');
    expect(
      bankMovementErrorFromMessage('SAME_ACCOUNT_TRANSFER:x'),
    ).toBeInstanceOf(SameAccountTransferError);
    expect(
      bankMovementErrorFromMessage('BANK_ACCOUNT_REQUIRED:x'),
    ).toBeInstanceOf(BankAccountRequiredError);
    expect(
      bankMovementErrorFromMessage('BANK_ACCOUNT_NOT_AVAILABLE:x')?.message,
    ).toBe(
      'La cuenta seleccionada no está habilitada para Transaccionar (Sistema → Bancos).',
    );
  });

  it('mapea la regla de BI Club como origen y el retiro de efectivo sin saldo', () => {
    expect(
      bankMovementErrorFromMessage('TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB')
        ?.message,
    ).toBe('BI Club Empresarial solo puede transferir a Banco Industrial.');
    expect(
      bankMovementErrorFromMessage('INSUFFICIENT_BALANCE:RETIRO_EFECTIVO')
        ?.message,
    ).toBe('Saldo insuficiente para realizar el retiro de efectivo.');
  });

  it('mapea las reglas de la línea de crédito de BI Club con los mensajes exactos', () => {
    const limit = bankMovementErrorFromMessage(
      'CREDIT_LINE_LIMIT_EXCEEDED:TRANSFERENCIA_ENTRADA:75000.00:25000.00',
    );
    expect(limit).toBeInstanceOf(CreditLineLimitExceededError);
    expect(limit?.message).toBe(
      'El monto excede el límite disponible de la línea de crédito de BI Club Empresarial.',
    );
    expect((limit as CreditLineLimitExceededError).status).toBe(400);

    const noDebt = bankMovementErrorFromMessage(
      'CREDIT_LINE_NO_DEBT:TRANSFERENCIA_SALIDA',
    );
    expect(noDebt).toBeInstanceOf(CreditLineNoDebtError);
    expect(noDebt?.message).toBe(
      'No existe saldo pendiente para realizar esta devolución.',
    );

    const overpayment = bankMovementErrorFromMessage(
      'CREDIT_LINE_OVERPAYMENT:TRANSFERENCIA_SALIDA:25000.00',
    );
    expect(overpayment).toBeInstanceOf(CreditLineOverpaymentError);
    expect(overpayment?.message).toBe(
      'El monto de devolución excede el saldo pendiente de la línea de crédito.',
    );
  });

  it('explica una anulación que rompería los límites de la línea de BI Club', () => {
    expect(
      bankMovementErrorFromMessage(
        'CREDIT_LINE_LIMIT_EXCEEDED:ANULACION:75000.00:0',
      )?.message,
    ).toContain('No es posible anular la operación');
    expect(
      bankMovementErrorFromMessage('CREDIT_LINE_OVERPAYMENT:ANULACION:10.00')
        ?.message,
    ).toContain('quedaría con saldo positivo');
    expect(
      bankMovementErrorFromMessage('LEGACY_CREDIT_LINE_TRANSFER:x'),
    ).toBeInstanceOf(LegacyCreditLineTransferError);
  });

  it('rechaza la línea Génesis como origen de su propio reintegro', () => {
    expect(
      bankMovementErrorFromMessage('REINTEGRO_SOURCE_IS_GENESIS:x'),
    ).toBeInstanceOf(ReintegroSourceIsGenesisError);
  });

  it('returns null for codes that are not balance rules (never leaks a technical message as a business one)', () => {
    expect(bankMovementErrorFromMessage('CASH_TOTAL_MISMATCH:x')).toBeNull();
    expect(
      bankMovementErrorFromMessage(
        'duplicate key value violates unique constraint',
      ),
    ).toBeNull();
  });
});
