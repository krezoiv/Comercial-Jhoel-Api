import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher.service';
import { TRANSACTION_MANAGER } from './application/ports/transaction-manager.port';
import { TypeOrmTransactionManager } from './infrastructure/services/typeorm-transaction-manager.service';

/**
 * Infrastructure genuinely shared across module boundaries: `auth`/`users`
 * both need to hash/compare passwords, so both import this module rather
 * than each wiring its own `BcryptPasswordHasher` provider. `TRANSACTION_MANAGER`
 * is the same idea for the one other cross-cutting need — a use case that
 * must commit two different modules' repository writes atomically (see
 * `bank-deposits`' Cuentas por Cobrar integration for its first real use).
 */
@Module({
  providers: [
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TRANSACTION_MANAGER, useClass: TypeOrmTransactionManager },
  ],
  exports: [PASSWORD_HASHER, TRANSACTION_MANAGER],
})
export class SharedModule {}
