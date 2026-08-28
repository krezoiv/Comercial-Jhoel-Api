import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { Product, ProductInput } from '../models';
import { PRODUCTS } from '../data';

const SIMULATED_LATENCY_MS = 400;

/**
 * Phase 2: back this with real HTTP calls against
 * `${environment.apiUrl}/inventory/products` (GET/POST/PATCH/DELETE) instead
 * of the in-memory array — every method's signature and Observable return
 * type are already what `HttpClient` would give you, so callers
 * (InventoryPageComponent, ProductFormModalComponent) shouldn't need to
 * change. Reads always return a fresh snapshot rather than a live stream, on
 * purpose: that's how a real GET behaves too, so callers already re-fetch
 * after a mutation instead of relying on this service to push updates.
 */
@Injectable({ providedIn: 'root' })
export class InventoryService {
  private products: Product[] = structuredClone(PRODUCTS);

  getProducts(): Observable<Product[]> {
    return of(structuredClone(this.products)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find((p) => p.id === id);
    return of(product ? structuredClone(product) : undefined).pipe(delay(SIMULATED_LATENCY_MS));
  }

  createProduct(input: ProductInput): Observable<Product> {
    const now = new Date().toISOString();
    const product: Product = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.products = [product, ...this.products];
    return of(structuredClone(product)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  updateProduct(id: string, input: ProductInput): Observable<Product> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Producto no encontrado.')).pipe(delay(SIMULATED_LATENCY_MS));
    }

    const updated: Product = {
      ...this.products[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.products = [...this.products.slice(0, index), updated, ...this.products.slice(index + 1)];
    return of(structuredClone(updated)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  deleteProduct(id: string): Observable<void> {
    this.products = this.products.filter((p) => p.id !== id);
    return of(undefined).pipe(delay(SIMULATED_LATENCY_MS));
  }
}
