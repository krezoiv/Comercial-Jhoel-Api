import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import { TicketOrmEntity } from './ticket.orm-entity';

@Entity('ticket_details')
export class TicketDetailOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ticket_id' })
  ticketId: string;

  @ManyToOne(() => TicketOrmEntity, (ticket) => ticket.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket: TicketOrmEntity;

  // No eager `product` relation — `productName`/`presentationName` are
  // snapshotted columns (frozen at creation time), unlike Purchases' own
  // `purchase_details`, which reads the live `product.name` via relation.
  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'product_name', type: 'varchar', length: 150 })
  productName: string;

  @Column({ name: 'presentation_name', type: 'varchar', length: 50, nullable: true })
  presentationName: string | null;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  unitPrice: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  total: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observation: string | null;
}
