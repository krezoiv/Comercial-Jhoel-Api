import {
  UnitOfMeasure,
  UnitOfMeasureProps,
} from '../entities/unit-of-measure.entity';

export const UNIT_OF_MEASURE_REPOSITORY = Symbol('UNIT_OF_MEASURE_REPOSITORY');

export interface FindUnitsOfMeasureOptions {
  activeOnly: boolean;
  search?: string;
}

export interface CreateUnitOfMeasureData {
  name: string;
  abbreviation: string;
  description: string | null;
  createdBy: string;
}

export interface UpdateUnitOfMeasureData {
  name?: string;
  abbreviation?: string;
  description?: string | null;
  isActive?: boolean;
  updatedBy: string;
}

/** One list row plus its live usage count — `usageCount` is never persisted, always computed fresh via a correlated subquery against `products`, never a full fetch-and-count in TypeScript. */
export interface UnitOfMeasureListItem extends UnitOfMeasureProps {
  usageCount: number;
}

export interface UnitOfMeasureRepository {
  findAll(
    options: FindUnitsOfMeasureOptions,
  ): Promise<UnitOfMeasureListItem[]>;
  findById(id: string): Promise<UnitOfMeasure | null>;
  /** Case-insensitive, trimmed — among active rows only. */
  findByActiveName(name: string): Promise<UnitOfMeasure | null>;
  /** Case-insensitive, trimmed — any state (backs the "ya existe pero está inactiva" reactivation prompt). */
  findByName(name: string): Promise<UnitOfMeasure | null>;
  findByActiveAbbreviation(abbreviation: string): Promise<UnitOfMeasure | null>;
  create(data: CreateUnitOfMeasureData): Promise<UnitOfMeasure>;
  update(id: string, data: UpdateUnitOfMeasureData): Promise<UnitOfMeasure>;
  deactivate(id: string): Promise<void>;
  /** Number of `products` rows currently referencing this unit — used only to warn before deactivating, never to block it. */
  countUsage(id: string): Promise<number>;
}
