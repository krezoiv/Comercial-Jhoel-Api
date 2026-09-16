import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { PhoneOrmEntity } from './infrastructure/persistence/phone.orm-entity';
import { TypeOrmPhoneRepository } from './infrastructure/persistence/typeorm-phone.repository';
import { TypeOrmPhoneSaleRepository } from './infrastructure/persistence/typeorm-phone-sale.repository';
import { PHONE_REPOSITORY } from './domain/repositories/phone.repository';
import { PHONE_SALE_REPOSITORY } from './domain/repositories/phone-sale.repository';
import { CreatePhoneUseCase } from './application/use-cases/create-phone.use-case';
import { ListPhonesUseCase } from './application/use-cases/list-phones.use-case';
import { GetPhoneByIdUseCase } from './application/use-cases/get-phone-by-id.use-case';
import { RegisterPhoneSaleUseCase } from './application/use-cases/register-phone-sale.use-case';
import { ListPhoneSalesUseCase } from './application/use-cases/list-phone-sales.use-case';
import { GetPhoneSaleByIdUseCase } from './application/use-cases/get-phone-sale-by-id.use-case';
import { GetPhoneSaleDpiImageUseCase } from './application/use-cases/get-phone-sale-dpi-image.use-case';
import { VoidPhoneSaleUseCase } from './application/use-cases/void-phone-sale.use-case';
import { PhonesController } from './presentation/controllers/phones.controller';
import { PhoneSalesController } from './presentation/controllers/phone-sales.controller';

/** No import of `RechargesModule` — the phones module is fully independent, only borrowing the SIM sale flow's *pattern* (see the migration's own doc comment), never its code or tables. */
@Module({
  imports: [TypeOrmModule.forFeature([PhoneOrmEntity]), ClientsModule],
  controllers: [PhonesController, PhoneSalesController],
  providers: [
    { provide: PHONE_REPOSITORY, useClass: TypeOrmPhoneRepository },
    { provide: PHONE_SALE_REPOSITORY, useClass: TypeOrmPhoneSaleRepository },
    CreatePhoneUseCase,
    ListPhonesUseCase,
    GetPhoneByIdUseCase,
    RegisterPhoneSaleUseCase,
    ListPhoneSalesUseCase,
    GetPhoneSaleByIdUseCase,
    GetPhoneSaleDpiImageUseCase,
    VoidPhoneSaleUseCase,
  ],
})
export class PhonesModule {}
