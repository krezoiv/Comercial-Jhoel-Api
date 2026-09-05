export const INVENTORY_TRANSFER_REPOSITORY = Symbol(
  'INVENTORY_TRANSFER_REPOSITORY',
);

export interface RegisterTransferData {
  productId: string;
  presentationId: string | null;
  fromLocationId: string;
  toLocationId: string;
  quantityPresentation: number;
  userId: string;
  reason?: string;
}

export interface InventoryTransferRepository {
  /** Invokes `register_inventory_transfer` — validates, moves stock atomically between two locations (never touches `products.stock`), and returns the shared `reference_id` grouping the two movement rows it wrote. */
  registerTransfer(data: RegisterTransferData): Promise<string>;
}
