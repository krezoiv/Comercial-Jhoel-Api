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
  /**
   * Same `register_inventory_transfer` function, called once per item but
   * wrapped in one outer DB transaction — every item commits together or
   * none do (a failure on item 3 of 5 rolls back items 1-2 as well). The
   * stored function itself is never touched or duplicated; this only adds
   * the multi-item transactional envelope the "un producto por llamada"
   * function was never meant to provide on its own.
   */
  registerTransferBatch(items: RegisterTransferData[]): Promise<string[]>;
}
