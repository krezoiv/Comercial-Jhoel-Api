import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('site_visits')
export class SiteVisitsOrmEntity {
  @PrimaryColumn({ type: 'smallint' })
  id: number;

  @Column({ name: 'total_count', type: 'integer' })
  totalCount: number;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
