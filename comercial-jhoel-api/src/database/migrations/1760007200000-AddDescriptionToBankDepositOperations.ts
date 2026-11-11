import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Transaccionar → "Descripción / Beneficiario": a free-text description (who
 * the operation was for, or its purpose) stored on the operation itself.
 *
 * - `bank_deposit_operations.description VARCHAR(250) NULL` — historical rows
 *   keep NULL (shown as "Sin descripción registrada"); never backfilled.
 * - `register_bank_deposit_operation` gains a trailing `p_description`
 *   (DEFAULT NULL, so internal/automatic callers keep working) and writes it
 *   in the SAME INSERT as the operation — no second statement that could get
 *   out of sync. It is sanitized in SQL too (control characters removed,
 *   whitespace collapsed, trimmed) and rejected above 250 characters.
 *   Nothing else in the function changes: amounts, bank/cash effects and
 *   commissions are untouched.
 * - A trigram index on the normalized text backs the report search.
 *
 * The function body is patched from its live definition (asserting each
 * anchor exists) instead of being copied, so no rule of the current function
 * can be lost. `down` restores the previous signature/body; the column and
 * its data are kept on purpose.
 */
export class AddDescriptionToBankDepositOperations1760007200000 implements MigrationInterface {
  name = 'AddDescriptionToBankDepositOperations1760007200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE bank_deposit_operations ADD COLUMN IF NOT EXISTS description VARCHAR(250) NULL`,
    );
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE bank_deposit_operations ADD CONSTRAINT "CHK_bank_deposit_operations_description"
          CHECK (description IS NULL OR (char_length(description) BETWEEN 1 AND 250 AND description = btrim(description)));
      EXCEPTION WHEN duplicate_object THEN NULL; END $$
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_bank_deposit_operations_description_trgm"
      ON bank_deposit_operations USING gin (public.search_normalize(description) gin_trgm_ops)
      WHERE description IS NOT NULL
    `);

    const current = await this.currentDefinition(queryRunner);
    const patched = patch(current, [
      [
        'p_cash_breakdown_enabled boolean DEFAULT true)',
        'p_cash_breakdown_enabled boolean DEFAULT true, p_description character varying DEFAULT NULL::character varying)',
      ],
      [
        '        v_cash_breakdown_enabled BOOLEAN := COALESCE(p_cash_breakdown_enabled, TRUE);',
        `        v_cash_breakdown_enabled BOOLEAN := COALESCE(p_cash_breakdown_enabled, TRUE);
        -- Descripción / Beneficiario: no control characters, single spaces, trimmed; NULL when empty.
        v_description VARCHAR := NULLIF(btrim(regexp_replace(regexp_replace(COALESCE(p_description, ''), '[[:cntrl:]]', ' ', 'g'), '\\s+', ' ', 'g')), '');`,
      ],
      [
        '          cash_breakdown_enabled\n        ) VALUES (',
        '          cash_breakdown_enabled, description\n        ) VALUES (',
      ],
      [
        '          v_cash_breakdown_enabled\n        )\n        RETURNING id INTO v_operation_id;',
        '          v_cash_breakdown_enabled, v_description\n        )\n        RETURNING id INTO v_operation_id;',
      ],
      [
        '        INSERT INTO bank_deposit_operations (',
        `        IF char_length(v_description) > 250 THEN
          RAISE EXCEPTION 'BANK_DEPOSIT_DESCRIPTION_TOO_LONG:%', char_length(v_description);
        END IF;

        INSERT INTO bank_deposit_operations (`,
      ],
    ]);

    await queryRunner.query(
      `DROP FUNCTION register_bank_deposit_operation(uuid, numeric, date, jsonb, jsonb, uuid, uuid, character varying, numeric, uuid, uuid, boolean)`,
    );
    await queryRunner.query(patched);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const current = await this.currentDefinition(queryRunner);
    const restored = patch(current, [
      [
        ', p_description character varying DEFAULT NULL::character varying)',
        ')',
      ],
      ['cash_breakdown_enabled, description\n', 'cash_breakdown_enabled\n'],
      [
        'v_cash_breakdown_enabled, v_description\n',
        'v_cash_breakdown_enabled\n',
      ],
    ])
      .replace(
        /\n\s*-- Descripción \/ Beneficiario:[^\n]*\n\s*v_description VARCHAR :=[^\n]*/,
        '',
      )
      .replace(
        /\s*IF char_length\(v_description\) > 250 THEN\s*RAISE EXCEPTION 'BANK_DEPOSIT_DESCRIPTION_TOO_LONG:%', char_length\(v_description\);\s*END IF;\n/,
        '\n\n',
      );
    await queryRunner.query(
      `DROP FUNCTION register_bank_deposit_operation(uuid, numeric, date, jsonb, jsonb, uuid, uuid, character varying, numeric, uuid, uuid, boolean, character varying)`,
    );
    await queryRunner.query(restored);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_bank_deposit_operations_description_trgm"`,
    );
    // The column, its CHECK and every stored description are kept on purpose.
  }

  private async currentDefinition(queryRunner: QueryRunner): Promise<string> {
    const rows = (await queryRunner.query(
      `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
       WHERE p.proname = 'register_bank_deposit_operation' AND p.pronamespace = 'public'::regnamespace`,
    )) as Array<{ def: string }>;
    if (rows.length !== 1) {
      throw new Error(
        `Expected exactly one register_bank_deposit_operation, found ${rows.length}`,
      );
    }
    return rows[0].def;
  }
}

/** Applies literal replacements, failing loudly if an anchor is missing (never a silent half-patch). */
function patch(source: string, replacements: Array<[string, string]>): string {
  return replacements.reduce((text, [from, to]) => {
    if (!text.includes(from)) {
      throw new Error(
        `register_bank_deposit_operation: anchor not found: ${from.slice(0, 80)}`,
      );
    }
    return text.replace(from, to);
  }, source);
}
