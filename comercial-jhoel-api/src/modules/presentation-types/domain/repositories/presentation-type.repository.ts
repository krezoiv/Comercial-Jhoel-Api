import {
  PresentationType,
  PresentationTypeProps,
} from '../entities/presentation-type.entity';

export const PRESENTATION_TYPE_REPOSITORY = Symbol(
  'PRESENTATION_TYPE_REPOSITORY',
);

export interface FindPresentationTypesOptions {
  activeOnly: boolean;
  search?: string;
}

export interface CreatePresentationTypeData {
  name: string;
  code: string | null;
  description: string | null;
  createdBy: string;
}

export interface UpdatePresentationTypeData {
  name?: string;
  code?: string | null;
  description?: string | null;
  isActive?: boolean;
  updatedBy: string;
}

/** One list row plus its live usage count — `usageCount` is never persisted, always computed fresh via a correlated subquery against `product_presentations`, never a full fetch-and-count in TypeScript. */
export interface PresentationTypeListItem extends PresentationTypeProps {
  usageCount: number;
}

export interface PresentationTypeRepository {
  findAll(
    options: FindPresentationTypesOptions,
  ): Promise<PresentationTypeListItem[]>;
  findById(id: string): Promise<PresentationType | null>;
  /** Case-insensitive, trimmed — among active rows only (the create-time "ya existe activo" check). */
  findByActiveName(name: string): Promise<PresentationType | null>;
  /** Case-insensitive, trimmed — any state, active or inactive (backs the "ya existe pero está inactiva" reactivation prompt). */
  findByName(name: string): Promise<PresentationType | null>;
  findByActiveCode(code: string): Promise<PresentationType | null>;
  create(data: CreatePresentationTypeData): Promise<PresentationType>;
  update(
    id: string,
    data: UpdatePresentationTypeData,
  ): Promise<PresentationType>;
  deactivate(id: string): Promise<void>;
  /** Number of `product_presentations` rows currently referencing this type — used only to warn before deactivating, never to block it. */
  countUsage(id: string): Promise<number>;
}
