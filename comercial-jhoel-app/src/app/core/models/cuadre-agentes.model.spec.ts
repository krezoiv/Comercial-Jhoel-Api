import { calculateCuadreResult } from './cuadre-agentes.model';

describe('calculateCuadreResult (cuadre consolidado)', () => {
  it('includes the cash under Bodega custody: a caja → Bodega delivery never changes the result', () => {
    const before = calculateCuadreResult(100000, 50000, 10000, 180000, 20000);
    const after = calculateCuadreResult(85000, 50000, 10000, 180000, 35000);
    expect(before).toBe(0);
    expect(after).toBe(before);
  });

  it('keeps the previous formula when there is no Bodega cash', () => {
    expect(calculateCuadreResult(63550.9, -44443.05, 106946.66, 126055.39)).toBeCloseTo(-0.88, 2);
  });
});
