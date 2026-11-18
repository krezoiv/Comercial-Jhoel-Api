import { SchoolPreparationAssignmentInput, SchoolQuotation } from '../../../core/models';
import { MAX_LINE_QUANTITY, SwapProduct } from './school-line-rules';

/**
 * Rules of "Preparación del pedido" (migration 1760008400000): each school
 * requirement is fulfilled by one or several inventory products. Everything
 * here is pure and only previews what the backend validates again:
 * `save_school_quotation_preparation` (assignments) and TERMINAR
 * ("Finalizar preparación": full coverage + Bodega stock under lock).
 *
 * The requirement — its text, quantity and quoted price — is never modified
 * here: an assignment only says which physical product will be packed.
 */

/** An inventory product assigned (or about to be) to a requirement. */
export interface DraftAssignment {
  /** Stable key in the screen (the product id: one assignment per product and requirement). */
  key: string;
  productId: string;
  productName: string;
  sku: string | null;
  categoryId: string | null;
  categoryName: string | null;
  quantity: number;
  /** Current public price of the product: reference only, the quoted price stays. */
  referencePrice: number;
}

/** A school requirement with its draft assignments. */
export interface RequirementDraft {
  itemId: string;
  lineNo: number;
  /** Original requirement text (what the customer sees). */
  description: string;
  detail: string | null;
  quantity: number;
  /** Quoted unit price (never recalculated from the products). */
  unitPrice: number;
  subtotal: number;
  assignments: DraftAssignment[];
}

/**
 * Visual state of a requirement card:
 * PENDIENTE (nothing assigned), INCOMPLETO (fewer units than requested),
 * EXCEDIDO (more units than requested), SIN_STOCK (covered but Bodega lacks
 * units), ASIGNADO (covered) and PREPARADO (preparation finished).
 */
export type RequirementState = 'PENDIENTE' | 'INCOMPLETO' | 'EXCEDIDO' | 'SIN_STOCK' | 'ASIGNADO' | 'PREPARADO';

export const REQUIREMENT_STATE_LABEL: Record<RequirementState, string> = {
  PENDIENTE: 'Pendiente de asignar producto',
  INCOMPLETO: 'Cantidad incompleta',
  EXCEDIDO: 'Cantidad excedida',
  SIN_STOCK: 'Inventario insuficiente',
  ASIGNADO: 'Producto asignado',
  PREPARADO: 'Requerimiento preparado',
};

export interface PreparationSummary {
  requirements: number;
  /** Requirements exactly covered. */
  assigned: number;
  pending: number;
  /** Distinct inventory products selected. */
  products: number;
  /** Units selected across all requirements. */
  units: number;
  /** Covered units over requested units, 0–100. */
  progress: number;
}

/** Builds the drafts from the saved quotation (lines + their assignments). */
export function requirementsFrom(quotation: SchoolQuotation): RequirementDraft[] {
  return quotation.items.map((item) => ({
    itemId: item.id,
    lineNo: item.lineNo,
    description: item.productName,
    detail: [item.description, item.observations].filter(Boolean).join(' · ') || null,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
    assignments: item.assignments.map((a) => ({
      key: a.productId,
      productId: a.productId,
      productName: a.productName,
      sku: a.productSku,
      categoryId: null,
      categoryName: a.categoryName,
      quantity: a.quantity,
      referencePrice: a.referencePrice,
    })),
  }));
}

export function assignedUnits(requirement: RequirementDraft): number {
  return requirement.assignments.reduce((sum, a) => sum + (a.quantity || 0), 0);
}

/** Units still to assign (never negative). */
export function remainingUnits(requirement: RequirementDraft): number {
  return Math.max(requirement.quantity - assignedUnits(requirement), 0);
}

/** Units of every product across the whole list (what "Finalizar" will take from Bodega). */
export function unitsByProduct(requirements: readonly RequirementDraft[]): Record<string, number> {
  const units: Record<string, number> = {};
  for (const requirement of requirements) {
    for (const a of requirement.assignments) {
      units[a.productId] = (units[a.productId] ?? 0) + (a.quantity || 0);
    }
  }
  return units;
}

/** Whether Bodega lacks units of the product for this list (unknown stock is not flagged). */
export function isShort(productId: string, units: Record<string, number>, stock: Record<string, number>): boolean {
  return productId in stock && (units[productId] ?? 0) > stock[productId];
}

export function requirementState(
  requirement: RequirementDraft,
  units: Record<string, number>,
  stock: Record<string, number>,
  finished = false,
): RequirementState {
  if (finished) return 'PREPARADO';
  const assigned = assignedUnits(requirement);
  if (assigned === 0) return 'PENDIENTE';
  if (assigned < requirement.quantity) return 'INCOMPLETO';
  if (assigned > requirement.quantity) return 'EXCEDIDO';
  return requirement.assignments.some((a) => isShort(a.productId, units, stock)) ? 'SIN_STOCK' : 'ASIGNADO';
}

export function preparationSummary(requirements: readonly RequirementDraft[], finished = false): PreparationSummary {
  const requested = requirements.reduce((sum, r) => sum + r.quantity, 0);
  const covered = requirements.reduce((sum, r) => sum + Math.min(assignedUnits(r), r.quantity), 0);
  const assigned = finished
    ? requirements.length
    : requirements.filter((r) => assignedUnits(r) === r.quantity).length;
  const units = requirements.reduce((sum, r) => sum + assignedUnits(r), 0);
  const products = new Set(requirements.flatMap((r) => r.assignments.map((a) => a.productId))).size;
  return {
    requirements: requirements.length,
    assigned,
    pending: requirements.length - assigned,
    products,
    units,
    progress: requested ? Math.floor((covered / requested) * 100) : 0,
  };
}

/**
 * Assigns a product to a requirement. If that product is already assigned to
 * the same requirement its units are added (one assignment per product), so a
 * duplicate never reaches the backend.
 */
export function assignProduct(
  requirements: readonly RequirementDraft[],
  itemId: string,
  product: SwapProduct,
  quantity: number,
): RequirementDraft[] {
  return requirements.map((r) => {
    if (r.itemId !== itemId) return r;
    const existing = r.assignments.find((a) => a.productId === product.id);
    if (existing) {
      return {
        ...r,
        assignments: r.assignments.map((a) =>
          a === existing ? { ...a, quantity: clamp(a.quantity + quantity) } : a,
        ),
      };
    }
    return { ...r, assignments: [...r.assignments, toAssignment(product, quantity)] };
  });
}

/**
 * "Cambiar producto" of one assignment: the old product leaves, the new one
 * takes its units (merged when it was already assigned to the requirement).
 */
export function replaceAssignment(
  requirements: readonly RequirementDraft[],
  itemId: string,
  key: string,
  product: SwapProduct,
  quantity: number,
): RequirementDraft[] {
  const without = removeAssignment(requirements, itemId, key);
  return assignProduct(without, itemId, product, quantity);
}

export function removeAssignment(requirements: readonly RequirementDraft[], itemId: string, key: string): RequirementDraft[] {
  return requirements.map((r) => (r.itemId === itemId ? { ...r, assignments: r.assignments.filter((a) => a.key !== key) } : r));
}

export function setAssignmentQuantity(
  requirements: readonly RequirementDraft[],
  itemId: string,
  key: string,
  quantity: number,
): RequirementDraft[] {
  return requirements.map((r) =>
    r.itemId === itemId
      ? { ...r, assignments: r.assignments.map((a) => (a.key === key ? { ...a, quantity } : a)) }
      : r,
  );
}

/** Problems that block saving (invalid quantities or over-assignment). */
export function saveProblems(requirements: readonly RequirementDraft[]): string[] {
  const problems: string[] = [];
  for (const r of requirements) {
    if (r.assignments.some((a) => !Number.isInteger(a.quantity) || a.quantity < 1 || a.quantity > MAX_LINE_QUANTITY)) {
      problems.push(`"${r.description}": cada cantidad asignada debe ser un entero entre 1 y 9,999.`);
    } else if (assignedUnits(r) > r.quantity) {
      problems.push(`"${r.description}": se asignaron ${assignedUnits(r)} unidad(es) y solo pide ${r.quantity}.`);
    }
  }
  return problems;
}

/** Problems that block "Finalizar preparación" (on top of the save problems). */
export function finishProblems(
  requirements: readonly RequirementDraft[],
  stock: Record<string, number>,
): string[] {
  const problems = saveProblems(requirements);
  const units = unitsByProduct(requirements);
  for (const r of requirements) {
    if (assignedUnits(r) < r.quantity) {
      problems.push(`"${r.description}": faltan ${r.quantity - assignedUnits(r)} unidad(es) por asignar.`);
    }
  }
  const short = new Map<string, string>();
  for (const r of requirements) {
    for (const a of r.assignments) {
      if (isShort(a.productId, units, stock)) {
        short.set(a.productId, `${a.productName}: Bodega tiene ${stock[a.productId]}, la lista necesita ${units[a.productId]}.`);
      }
    }
  }
  return [...problems, ...short.values()];
}

/** Payload of `PUT /school-lists/quotations/:id/preparation`. */
export function toPreparationPayload(requirements: readonly RequirementDraft[]): SchoolPreparationAssignmentInput[] {
  return requirements.flatMap((r) =>
    r.assignments.map((a) => ({ itemId: r.itemId, productId: a.productId, quantity: a.quantity })),
  );
}

/** Stable comparison key (detects unsaved changes). */
export function preparationSignature(requirements: readonly RequirementDraft[]): string {
  return JSON.stringify(
    toPreparationPayload(requirements)
      .map((a) => `${a.itemId}:${a.productId}:${a.quantity}`)
      .sort(),
  );
}

function toAssignment(product: SwapProduct, quantity: number): DraftAssignment {
  return {
    key: product.id,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    quantity: clamp(quantity),
    referencePrice: product.publicPrice,
  };
}

function clamp(quantity: number): number {
  return Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.trunc(quantity || 0)));
}
