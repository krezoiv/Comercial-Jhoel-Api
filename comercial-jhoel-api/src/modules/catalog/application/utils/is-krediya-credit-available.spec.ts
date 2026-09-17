import { isKrediyaCreditAvailable } from './is-krediya-credit-available';

describe('isKrediyaCreditAvailable', () => {
  const MIN_AMOUNT = 1000;

  it.each([
    [999, false],
    [999.99, false],
    [1000, true],
    [1500, true],
    [2999, true],
    [10000, true],
  ])('price %d -> creditAvailable %s', (price, expected) => {
    expect(isKrediyaCreditAvailable(price, MIN_AMOUNT)).toBe(expected);
  });

  it('returns false when no threshold is configured (null)', () => {
    expect(isKrediyaCreditAvailable(5000, null)).toBe(false);
  });

  it('returns false when the threshold is zero or negative (offer disabled)', () => {
    expect(isKrediyaCreditAvailable(5000, 0)).toBe(false);
    expect(isKrediyaCreditAvailable(5000, -1)).toBe(false);
  });
});
