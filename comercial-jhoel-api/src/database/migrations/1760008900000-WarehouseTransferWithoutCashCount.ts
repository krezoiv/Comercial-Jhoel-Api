import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Caja → Bodega no longer depends on the Arqueo de Caja (owner request,
 * 2026-11-20).
 *
 * Since migration 1760007800000 `register_cash_warehouse_transfer` called
 * `cash_assert_denominations_available('CAJA', …)`: it rejected the delivery
 * when no arqueo existed (`CASH_COUNT_REQUIRED`) and capped every bill/coin by
 * the inventory derived from the LAST arqueo (`CASH_DENOMINATION_NOT_AVAILABLE`).
 * The arqueo is a control of the physical cash, not a source of availability,
 * so that call is removed. The only availability rule left is the official
 * caja balance read under the caja lock:
 *
 *     amount ≤ cash_balance()
 *
 * rejected as `CASH_WAREHOUSE_TRANSFER_EXCEEDS_CASH:<available>` so the API can
 * say how much cash is available.
 *
 * Everything else is unchanged:
 * - The breakdown stays mandatory and must add up to the amount.
 * - Lock order is caja → Bodega.
 * - Idempotency key, both Kardex rows in one transaction, breakdown stored in
 *   `cash_movement_details`, `ENT-` reference.
 *
 * The breakdown of a confirmed transfer is read-only: `cash_movement_details`
 * gets the same immutability guard as every other custody detail table
 * (nothing in the system updates or deletes those rows).
 *
 * Bodega's own rules also stay: its initial count and per-denomination checks
 * on withdrawals. The caja inventory view keeps working; it may now show a
 * negative quantity when bills leave that the last arqueo never counted, which
 * means that arqueo is outdated.
 */

async function liveDefinition(
  queryRunner: QueryRunner,
  fn: string,
): Promise<string> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [fn],
  )) as Array<{ def: string }>;
  if (rows.length !== 1) {
    throw new Error(`${fn}: expected exactly one definition`);
  }
  return rows[0].def;
}

function replaceOnce(
  def: string,
  fn: string,
  from: string,
  to: string,
): string {
  if (def.split(from).length !== 2) {
    throw new Error(`${fn}: anchor not found exactly once`);
  }
  return def.replace(from, to);
}

async function patchFunction(
  queryRunner: QueryRunner,
  fn: string,
  patches: Array<[string, string]>,
): Promise<void> {
  let def = await liveDefinition(queryRunner, fn);
  for (const [from, to] of patches) {
    def = replaceOnce(def, fn, from, to);
  }
  await queryRunner.query(def);
}

const FN = 'register_cash_warehouse_transfer';

const PATCHES: Array<[string, string]> = [
  [
    `        IF cash_balance() < p_amount THEN
          RAISE EXCEPTION 'CASH_INSUFFICIENT_BALANCE';
        END IF;
        -- Every bill/coin sent must be available in the caja inventory (under the caja lock).
        PERFORM cash_assert_denominations_available('CAJA', p_details);`,
    `        -- Availability = the OFFICIAL caja balance (Kardex), read under the caja
        -- lock. Never the last Arqueo de Caja (migration 1760008900000).
        IF cash_balance() < p_amount THEN
          RAISE EXCEPTION 'CASH_WAREHOUSE_TRANSFER_EXCEEDS_CASH:%', cash_balance();
        END IF;`,
  ],
];

export class WarehouseTransferWithoutCashCount1760008900000 implements MigrationInterface {
  name = 'WarehouseTransferWithoutCashCount1760008900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await patchFunction(queryRunner, FN, PATCHES);
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_movement_details_guard
        BEFORE UPDATE OR DELETE ON cash_movement_details
        FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP TRIGGER IF EXISTS trg_cash_movement_details_guard ON cash_movement_details',
    );
    await patchFunction(
      queryRunner,
      FN,
      PATCHES.map(([from, to]) => [to, from]),
    );
  }
}
