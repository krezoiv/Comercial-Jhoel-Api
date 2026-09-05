import { PresentationType } from '../../domain/entities/presentation-type.entity';
import { PresentationTypeListItem } from '../../domain/repositories/presentation-type.repository';

export interface PresentationTypeOutput {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface PresentationTypeListOutput extends PresentationTypeOutput {
  usageCount: number;
}

export function toPresentationTypeOutput(
  presentationType: PresentationType,
): PresentationTypeOutput {
  return {
    id: presentationType.id,
    name: presentationType.name,
    code: presentationType.code,
    description: presentationType.description,
    isActive: presentationType.isActive,
    createdAt: presentationType.createdAt,
    updatedAt: presentationType.updatedAt,
    createdBy: presentationType.createdBy,
    createdByUsername: presentationType.createdByUsername,
    updatedBy: presentationType.updatedBy,
    updatedByUsername: presentationType.updatedByUsername,
  };
}

export function toPresentationTypeListOutput(
  item: PresentationTypeListItem,
): PresentationTypeListOutput {
  return { ...item, usageCount: item.usageCount };
}
