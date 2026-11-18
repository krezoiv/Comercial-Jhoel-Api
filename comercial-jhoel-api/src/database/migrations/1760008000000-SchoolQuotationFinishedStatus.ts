import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Listas Escolares — new status TERMINADA: the list is packed and dispatched,
 * ready to be handed to the customer.
 *
 * Flow: COTIZADA / ANTICIPO_RECIBIDO / PAGO_PARCIAL / PAGADA / EN_PREPARACION
 *   → (TERMINAR) TERMINADA → (ENTREGAR, balance 0) ENTREGADA.
 * A TERMINADA quotation keeps receiving abonos (the status stays TERMINADA,
 * like EN_PREPARACION) and can still be edited or cancelled; only delivery
 * requires the whole balance paid. Who/when finished it is recorded.
 *
 * Live functions are patched on verified anchors (each must occur exactly
 * once); `down` restores them and refuses to run while any quotation is
 * TERMINADA (it would violate the original status CHECK).
 */
const REFRESH_FROM = `IF v_q.status IN ('BORRADOR','EN_PREPARACION','ENTREGADA','CANCELADA') THEN`;
const REFRESH_TO = `IF v_q.status IN ('BORRADOR','EN_PREPARACION','TERMINADA','ENTREGADA','CANCELADA') THEN`;

const DELIVER_FROM = `ELSIF p_action = 'ENTREGAR' AND v_q.status IN ('PAGADA','EN_PREPARACION') THEN`;
const DELIVER_TO = `ELSIF p_action = 'TERMINAR' AND v_q.status IN ('COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA','EN_PREPARACION') THEN
          -- Packed and dispatched, ready for the customer (payments may still be pending).
          v_status := 'TERMINADA';
          UPDATE school_quotations SET status = v_status, finished_at = now(), finished_by = p_user_id
           WHERE id = p_quotation_id;
        ELSIF p_action = 'ENTREGAR' AND v_q.status IN ('PAGADA','EN_PREPARACION','TERMINADA') THEN`;

const STATUSES = `'BORRADOR','COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA','EN_PREPARACION','ENTREGADA','CANCELADA'`;

async function patchFunction(
  queryRunner: QueryRunner,
  name: string,
  from: string,
  to: string,
): Promise<void> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [name],
  )) as Array<{ def: string }>;
  if (rows.length !== 1 || rows[0].def.split(from).length !== 2) {
    throw new Error(`${name}: anchor not found exactly once`);
  }
  await queryRunner.query(rows[0].def.replace(from, to));
}

export class SchoolQuotationFinishedStatus1760008000000 implements MigrationInterface {
  name = 'SchoolQuotationFinishedStatus1760008000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE school_quotations DROP CONSTRAINT school_quotations_status_check;
      ALTER TABLE school_quotations ADD CONSTRAINT school_quotations_status_check
        CHECK (status IN (${STATUSES},'TERMINADA'));
      ALTER TABLE school_quotations
        ADD COLUMN finished_at TIMESTAMPTZ,
        ADD COLUMN finished_by UUID REFERENCES users(id) ON DELETE RESTRICT;
    `);
    await patchFunction(
      queryRunner,
      'school_quotation_refresh_status',
      REFRESH_FROM,
      REFRESH_TO,
    );
    await patchFunction(
      queryRunner,
      'change_school_quotation_status',
      DELIVER_FROM,
      DELIVER_TO,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [{ count }] = (await queryRunner.query(
      `SELECT count(*)::INT AS count FROM school_quotations WHERE status = 'TERMINADA'`,
    )) as { count: number }[];
    if (count > 0) {
      throw new Error(
        `Hay ${count} cotización(es) TERMINADA; entréguelas o cancélelas antes de revertir esta migración.`,
      );
    }
    await patchFunction(
      queryRunner,
      'change_school_quotation_status',
      DELIVER_TO,
      DELIVER_FROM,
    );
    await patchFunction(
      queryRunner,
      'school_quotation_refresh_status',
      REFRESH_TO,
      REFRESH_FROM,
    );
    await queryRunner.query(`
      ALTER TABLE school_quotations DROP COLUMN finished_by, DROP COLUMN finished_at;
      ALTER TABLE school_quotations DROP CONSTRAINT school_quotations_status_check;
      ALTER TABLE school_quotations ADD CONSTRAINT school_quotations_status_check
        CHECK (status IN (${STATUSES}));
    `);
  }
}
