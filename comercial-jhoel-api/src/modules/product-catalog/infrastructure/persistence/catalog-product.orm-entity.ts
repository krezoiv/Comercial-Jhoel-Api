import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductOrmEntity } from '../../../products/infrastructure/persistence/product.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import type { CatalogProductSection } from '../../domain/entities/catalog-product.entity';

/**
 * `product` es una relación `ManyToOne` eager a `ProductOrmEntity` — un
 * import de tipo directo, no un import del `ProductsModule` (mismo patrón
 * ya documentado en este código para `SaleOrmEntity`/`SaleDetailOrmEntity`
 * → `ProductOrmEntity`: metadata de relación a nivel de TypeScript, nunca
 * un acoplamiento de módulos NestJS). Como `ProductOrmEntity.category`/
 * `.business`/`.unitOfMeasure` ya son eager, una sola consulta trae todo
 * lo necesario para mostrar nombre/precio/categoría/negocio — sin duplicar
 * ese dato en esta tabla.
 *
 * `imageData` usa `select: false` — nunca viaja en un `find()`/`findOne()`
 * normal (listados de catálogo nunca cargan los bytes de imagen de cada
 * fila); solo `getImage()` en el repositorio la selecciona explícitamente.
 */
@Entity('catalog_products')
export class CatalogProductOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => ProductOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  @Column({ type: 'varchar', length: 30 })
  section: CatalogProductSection;

  @Column({ name: 'catalog_description', type: 'text', nullable: true })
  catalogDescription: string | null;

  @Column({ name: 'image_data', type: 'bytea', nullable: true, select: false })
  imageData: Buffer | null;

  @Column({ name: 'image_mime_type', type: 'varchar', length: 50, nullable: true })
  imageMimeType: string | null;

  @Column({ name: 'image_size_bytes', type: 'integer', nullable: true })
  imageSizeBytes: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ name: 'likes_count', type: 'integer', default: 0 })
  likesCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string | null;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserOrmEntity | null;
}
