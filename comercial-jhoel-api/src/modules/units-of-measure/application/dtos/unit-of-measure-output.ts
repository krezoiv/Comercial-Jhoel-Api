import { UnitOfMeasure } from '../../domain/entities/unit-of-measure.entity';
import { UnitOfMeasureListItem } from '../../domain/repositories/unit-of-measure.repository';

export interface UnitOfMeasureOutput {
  id: string;
  name: string;
  abbreviation: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface UnitOfMeasureListOutput extends UnitOfMeasureOutput {
  usageCount: number;
}

export function toUnitOfMeasureOutput(
  unitOfMeasure: UnitOfMeasure,
): UnitOfMeasureOutput {
  return {
    id: unitOfMeasure.id,
    name: unitOfMeasure.name,
    abbreviation: unitOfMeasure.abbreviation,
    description: unitOfMeasure.description,
    isActive: unitOfMeasure.isActive,
    createdAt: unitOfMeasure.createdAt,
    updatedAt: unitOfMeasure.updatedAt,
    createdBy: unitOfMeasure.createdBy,
    createdByUsername: unitOfMeasure.createdByUsername,
    updatedBy: unitOfMeasure.updatedBy,
    updatedByUsername: unitOfMeasure.updatedByUsername,
  };
}

export function toUnitOfMeasureListOutput(
  item: UnitOfMeasureListItem,
): UnitOfMeasureListOutput {
  return { ...item, usageCount: item.usageCount };
}
