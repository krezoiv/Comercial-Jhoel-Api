import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type { GuayacanCashBoxRepository } from '../../domain/repositories/guayacan-cash-box.repository';

/** Usuarios que han registrado arqueos — opciones del filtro "Usuario". */
@Injectable()
export class ListGuayacanCashCountUsersUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  execute(): Promise<{ id: string; username: string }[]> {
    return this.repository.findCountUsers();
  }
}
