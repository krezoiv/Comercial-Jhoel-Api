import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketOrmEntity } from './infrastructure/persistence/ticket.orm-entity';
import { TicketDetailOrmEntity } from './infrastructure/persistence/ticket-detail.orm-entity';
import { TypeOrmTicketRepository } from './infrastructure/persistence/typeorm-ticket.repository';
import { TICKET_REPOSITORY } from './domain/repositories/ticket.repository';
import { CreateTicketUseCase } from './application/use-cases/create-ticket.use-case';
import { ListTicketsUseCase } from './application/use-cases/list-tickets.use-case';
import { GetTicketByIdUseCase } from './application/use-cases/get-ticket-by-id.use-case';
import { VoidTicketUseCase } from './application/use-cases/void-ticket.use-case';
import { GetTicketPdfUseCase } from './application/use-cases/get-ticket-pdf.use-case';
import { TicketsController } from './presentation/controllers/tickets.controller';
import { ClientsModule } from '../clients/clients.module';
import { CompanySettingsModule } from '../company-settings/company-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketOrmEntity, TicketDetailOrmEntity]),
    ClientsModule,
    CompanySettingsModule,
  ],
  controllers: [TicketsController],
  providers: [
    { provide: TICKET_REPOSITORY, useClass: TypeOrmTicketRepository },
    CreateTicketUseCase,
    ListTicketsUseCase,
    GetTicketByIdUseCase,
    VoidTicketUseCase,
    GetTicketPdfUseCase,
  ],
})
export class TicketsModule {}
