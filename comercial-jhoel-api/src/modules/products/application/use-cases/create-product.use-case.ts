import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { BUSINESS_REPOSITORY } from '../../../businesses/domain/repositories/business.repository';
import type { BusinessRepository } from '../../../businesses/domain/repositories/business.repository';
import { PRODUCT_PRESENTATION_REPOSITORY } from '../../../inventory/domain/repositories/product-presentation.repository';
import type { ProductPresentationRepository } from '../../../inventory/domain/repositories/product-presentation.repository';
import { INVENTORY_STOCK_REPOSITORY } from '../../../inventory/domain/repositories/inventory-stock.repository';
import type { InventoryStockRepository } from '../../../inventory/domain/repositories/inventory-stock.repository';
import { INVENTORY_LOCATION_REPOSITORY } from '../../../inventory/domain/repositories/inventory-location.repository';
import type { InventoryLocationRepository } from '../../../inventory/domain/repositories/inventory-location.repository';
import { UNIT_OF_MEASURE_REPOSITORY } from '../../../units-of-measure/domain/repositories/unit-of-measure.repository';
import type { UnitOfMeasureRepository } from '../../../units-of-measure/domain/repositories/unit-of-measure.repository';
import { PRESENTATION_TYPE_REPOSITORY } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import { ProductNameAlreadyExistsError } from '../../domain/errors/product-name-already-exists.error';
import { ProductSkuAlreadyExistsError } from '../../domain/errors/product-sku-already-exists.error';
import { InvalidCategoryError } from '../../domain/errors/invalid-category.error';
import { InvalidBusinessError } from '../../domain/errors/invalid-business.error';
import { InvalidUnitOfMeasureError } from '../../domain/errors/invalid-unit-of-measure.error';
import { ProductOutput, toProductOutput } from '../dtos/product-output';

export interface CreateProductInput {
  name: string;
  sku?: string;
  categoryId: string;
  businessId: string;
  unitOfMeasureId: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
}

/** The name of the always-seeded, immutable base presentation type — see `CreatePresentationTypesAndUnitsOfMeasure`'s own seed and `UnidadPresentationImmutableError`'s reasoning. */
const UNIDAD_PRESENTATION_TYPE_NAME = 'Unidad';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
    @Inject(PRODUCT_PRESENTATION_REPOSITORY)
    private readonly presentationRepository: ProductPresentationRepository,
    @Inject(INVENTORY_STOCK_REPOSITORY)
    private readonly stockRepository: InventoryStockRepository,
    @Inject(INVENTORY_LOCATION_REPOSITORY)
    private readonly locationRepository: InventoryLocationRepository,
    @Inject(UNIT_OF_MEASURE_REPOSITORY)
    private readonly unitOfMeasureRepository: UnitOfMeasureRepository,
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<ProductOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    // Referenced-entity validation runs before the uniqueness checks below
    // — a product pointing at a deleted/deactivated category or business
    // is a data-integrity problem worth catching before spending a query
    // on name/SKU uniqueness, which only matters once the FKs are known
    // to be valid.
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category || !category.isActive) {
      throw new InvalidCategoryError();
    }

    const business = await this.businessRepository.findById(input.businessId);
    if (!business || !business.isActive) {
      throw new InvalidBusinessError();
    }

    const unitOfMeasure = await this.unitOfMeasureRepository.findById(
      input.unitOfMeasureId,
    );
    if (!unitOfMeasure || !unitOfMeasure.isActive) {
      throw new InvalidUnitOfMeasureError();
    }

    const existing = await this.productRepository.findByActiveName(name);
    if (existing) {
      throw new ProductNameAlreadyExistsError(name);
    }

    // `sku` is genuinely optional (a barcode a product may not have yet) —
    // an empty/blank value is normalized to `null` rather than an empty
    // string, matching the partial unique index (`UQ_products_sku_active`)
    // that only enforces uniqueness among non-null, active rows.
    const sku = input.sku?.trim() || null;
    if (sku) {
      const existingSku = await this.productRepository.findByActiveSku(sku);
      if (existingSku) {
        throw new ProductSkuAlreadyExistsError(sku);
      }

      // `sku` doubles as the auto-created "Unidad" presentation's own
      // barcode below — pre-checked here (not just left to the DB
      // constraint) because a collision caught *after* the product row
      // already exists would leave it without its required "Unidad"
      // presentation, an inconsistent state this use case has no
      // transaction wrapping it to roll back (see this method's own
      // sequential create() calls).
      const existingBarcode =
        await this.presentationRepository.findActiveByBarcode(sku);
      if (existingBarcode) {
        throw new ProductSkuAlreadyExistsError(sku);
      }
    }

    const product = await this.productRepository.create({
      name,
      sku,
      categoryId: input.categoryId,
      businessId: input.businessId,
      unitOfMeasureId: input.unitOfMeasureId,
      costPrice: input.costPrice,
      publicPrice: input.publicPrice,
      wholesalePrice: input.wholesalePrice,
      stock: input.stock,
    });

    // Every product gets its base "Unidad" presentation (factor 1, mirrors
    // the product's own prices) — this is what every existing Compras/
    // Ventas call (which never sends a presentation) resolves to. `stock`
    // above became the product's running total; here it becomes the
    // initial Bodega balance specifically ("las compras ingresan a
    // Bodega" — a brand-new product's opening stock is no different).
    // Vitrina always starts at 0 — never an invented distribution.
    // "Unidad" is always resolved from the master `presentation_types`
    // catalog (seeded, immutable — see `UnidadPresentationImmutableError`),
    // never a literal string on this row anymore.
    const unidadPresentationType =
      await this.presentationTypeRepository.findByActiveName(
        UNIDAD_PRESENTATION_TYPE_NAME,
      );
    if (!unidadPresentationType) {
      throw new InternalServerErrorException(
        'No se encontró el tipo de presentación base "Unidad" — la migración del catálogo debió sembrarlo.',
      );
    }
    // "Unidad"'s own barcode defaults to the product's own sku, when given —
    // this is what keeps "scan the code you already had" working with zero
    // extra admin steps for the unit-level flow (Ventas always sells at
    // "Unidad"); a distinct "Caja" barcode is added separately afterward.
    await this.presentationRepository.create({
      productId: product.id,
      presentationTypeId: unidadPresentationType.id,
      conversionFactor: 1,
      costPrice: input.costPrice,
      publicPrice: input.publicPrice,
      barcode: sku,
    });

    const locations = await this.locationRepository.findAll({
      activeOnly: true,
    });
    const bodega = locations.find((location) => location.name === 'Bodega');
    await this.stockRepository.createInitial(
      product.id,
      locations.map((location) => ({
        locationId: location.id,
        quantity: location.id === bodega?.id ? input.stock : 0,
      })),
    );

    return toProductOutput(product);
  }
}
