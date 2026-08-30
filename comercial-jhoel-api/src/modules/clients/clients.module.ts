import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientOrmEntity } from './infrastructure/persistence/client.orm-entity';
import { TypeOrmClientRepository } from './infrastructure/persistence/typeorm-client.repository';
import { CLIENT_REPOSITORY } from './domain/repositories/client.repository';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { ListClientsUseCase } from './application/use-cases/list-clients.use-case';
import { GetClientByIdUseCase } from './application/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { DeactivateClientUseCase } from './application/use-cases/deactivate-client.use-case';
import { ClientsController } from './presentation/controllers/clients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity])],
  controllers: [ClientsController],
  providers: [
    {
      provide: CLIENT_REPOSITORY,
      useClass: TypeOrmClientRepository,
    },
    CreateClientUseCase,
    ListClientsUseCase,
    GetClientByIdUseCase,
    UpdateClientUseCase,
    DeactivateClientUseCase,
  ],
  // Exported so a future Ventas cliente_id relation can resolve/validate
  // against it the same way ProductsModule reaches CategoriesModule.
  exports: [CLIENT_REPOSITORY],
})
export class ClientsModule {}
