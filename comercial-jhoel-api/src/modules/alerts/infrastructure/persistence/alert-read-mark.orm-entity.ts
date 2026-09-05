import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('alert_read_marks')
export class AlertReadMarkOrmEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'alert_key', type: 'varchar', length: 255 })
  alertKey: string;

  @CreateDateColumn({ name: 'read_at' })
  readAt: Date;
}
