import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cash integrity (owner request, 2026-11-21: "eliminar descuadres y detectar
 * desviaciones de efectivo"). Two pieces of evidence, both append-only:
 *
 * 1. Arqueo de apertura (`cash_opening_counts`): the physical count at the
 *    start of the bank day, reconciled with the OFFICIAL closing of the
 *    previous day (`cash_balance_at(<bank-day anchor>)`). It IS a normal Arqueo
 *    de Caja (`register_cash_count`, same locks and photograph) plus its
 *    opening facts: previous closing balance, physical movements since the
 *    opening, the last count before the day (what was counted at the close)
 *    and — mandatory when there is a difference — reason and responsible.
 *    One per bank day. Supervisors and admins (`cash_custody.operate`, owner
 *    decision). It never blocks operations (owner decision: warning only) and
 *    never changes the previous day.
 *
 * 2. Difference resolutions (`cash_difference_resolutions`): how an arqueo
 *    with faltante / sobrante was closed — admins only (owner decision). It
 *    records the cause (error de registro, de cálculo, duplicado, omitido,
 *    diferencia de arqueo, inconsistencia histórica, no determinada) and a
 *    written explanation; for Caja it may ALSO register, in the same
 *    transaction, the authorized AJUSTE to the Kardex for exactly the counted
 *    difference (OUT for a faltante, IN for a sobrante), linked to the count.
 *    The difference stays visible as "resuelta"; nothing is ever squared
 *    automatically and no row is edited or deleted.
 */
export class CashOpeningCountsAndDifferenceResolutions1760009200000 implements MigrationInterface {
  name = 'CashOpeningCountsAndDifferenceResolutions1760009200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE cash_opening_counts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        count_id UUID NOT NULL REFERENCES cash_counts(id) ON DELETE RESTRICT,
        day_opening_id UUID NOT NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        business_date DATE NOT NULL,
        -- Official closing of the previous day = Kardex balance at the bank-day anchor.
        previous_close_balance NUMERIC(14,2) NOT NULL,
        -- Physical movements registered between the opening and this count.
        movements_since_opening INTEGER NOT NULL,
        -- The last physical count before the day (what was counted at the close).
        previous_count_source VARCHAR(15),
        previous_count_id UUID,
        previous_count_label VARCHAR(80),
        previous_count_at TIMESTAMPTZ,
        previous_counted NUMERIC(14,2),
        previous_difference NUMERIC(14,2),
        -- counted − theoretical at the moment of the count (copied from the arqueo).
        difference NUMERIC(14,2) NOT NULL,
        difference_reason VARCHAR(255),
        responsible VARCHAR(120),
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_opening_counts_count" UNIQUE (count_id),
        CONSTRAINT "UQ_cash_opening_counts_day" UNIQUE (day_opening_id),
        CONSTRAINT "CHK_cash_opening_counts_explained" CHECK (
          difference = 0
          OR (length(btrim(difference_reason)) >= 5 AND length(btrim(responsible)) >= 3)
        ),
        CONSTRAINT "CHK_cash_opening_counts_previous_source" CHECK (
          previous_count_source IS NULL OR previous_count_source IN ('ARQUEO_CAJA', 'CORTE')
        )
      )
    `);
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_opening_counts_guard BEFORE UPDATE OR DELETE ON cash_opening_counts
        FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard()
    `);

    await queryRunner.query(`
      CREATE TABLE cash_difference_resolutions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        count_source VARCHAR(15) NOT NULL,
        count_id UUID NOT NULL,
        count_label VARCHAR(80) NOT NULL,
        -- The difference being resolved, as it was recorded by the count.
        difference NUMERIC(14,2) NOT NULL,
        cause VARCHAR(30) NOT NULL,
        explanation VARCHAR(500) NOT NULL,
        adjustment_movement_id UUID REFERENCES cash_movements(id) ON DELETE RESTRICT,
        idempotency_key VARCHAR(120) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_difference_resolutions_count" UNIQUE (count_source, count_id),
        CONSTRAINT "UQ_cash_difference_resolutions_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "CHK_cash_difference_resolutions_source" CHECK (count_source IN ('ARQUEO_CAJA', 'CORTE', 'ARQUEO_BODEGA')),
        CONSTRAINT "CHK_cash_difference_resolutions_cause" CHECK (cause IN (
          'ERROR_REGISTRO', 'ERROR_CALCULO', 'MOVIMIENTO_DUPLICADO', 'MOVIMIENTO_OMITIDO',
          'DIFERENCIA_ARQUEO', 'INCONSISTENCIA_HISTORICA', 'NO_DETERMINADA'
        )),
        CONSTRAINT "CHK_cash_difference_resolutions_difference" CHECK (difference <> 0),
        CONSTRAINT "CHK_cash_difference_resolutions_explanation" CHECK (length(btrim(explanation)) >= 10),
        -- Bodega has no adjustment type: its differences are explained, not adjusted here.
        CONSTRAINT "CHK_cash_difference_resolutions_adjustment" CHECK (
          adjustment_movement_id IS NULL OR count_source IN ('ARQUEO_CAJA', 'CORTE')
        )
      )
    `);
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_difference_resolutions_guard BEFORE UPDATE OR DELETE ON cash_difference_resolutions
        FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard()
    `);

    await queryRunner.query(`
      -- Arqueo de apertura: a normal Arqueo de Caja + its reconciliation with the
      -- official closing of the previous day. Never moves cash, never blocks.
      CREATE FUNCTION register_cash_opening_count(
        p_details JSONB,
        p_observations VARCHAR,
        p_reason VARCHAR,
        p_responsible VARCHAR,
        p_user_id UUID,
        p_idempotency_key VARCHAR
      ) RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_count_id UUID;
        v_count cash_counts%ROWTYPE;
        v_anchor cash_bank_day_openings%ROWTYPE;
        v_previous RECORD;
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.operate');
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        -- A retry returns the same opening count.
        SELECT o.count_id INTO v_count_id
        FROM cash_opening_counts o JOIN cash_counts c ON c.id = o.count_id
        WHERE c.idempotency_key = 'APE:' || p_idempotency_key;
        IF FOUND THEN
          RETURN v_count_id;
        END IF;

        SELECT a.* INTO v_anchor
        FROM cash_bank_day_openings a
        JOIN cash_bank_day_ranges r ON r.id = a.id AND r.is_current;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_CUSTODY_DAY_NOT_OPEN';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_opening_count:' || v_anchor.day_opening_id));
        IF EXISTS (SELECT 1 FROM cash_opening_counts WHERE day_opening_id = v_anchor.day_opening_id) THEN
          RAISE EXCEPTION 'CASH_OPENING_COUNT_EXISTS';
        END IF;

        -- The count itself: same rules, locks and photograph as any Arqueo de Caja.
        v_count_id := register_cash_count(p_details, p_observations, NULL, p_user_id,
                                          'APE:' || p_idempotency_key, NULL, NULL);
        SELECT * INTO v_count FROM cash_counts WHERE id = v_count_id;
        IF v_count.difference <> 0 AND (
             p_reason IS NULL OR length(btrim(p_reason)) < 5
             OR p_responsible IS NULL OR length(btrim(p_responsible)) < 3) THEN
          RAISE EXCEPTION 'CASH_OPENING_DIFFERENCE_REASON_REQUIRED:%', v_count.difference;
        END IF;

        -- The last physical count BEFORE the day: Arqueo de Caja or the current count of a finished cut.
        SELECT * INTO v_previous FROM (
          SELECT 'ARQUEO_CAJA'::text AS source, c.id, 'Arqueo de Caja #' || c.number AS label,
                 c.counted_at AS at, c.total_counted AS counted, c.difference
          FROM cash_counts c
          WHERE c.status = 'VIGENTE' AND c.id <> v_count_id AND c.counted_at <= v_anchor.opened_at
          UNION ALL
          SELECT 'CORTE', k.id, 'Corte ' || p.period_number || ' · ' || to_char(d.operational_date, 'DD/MM/YYYY'),
                 k.created_at, k.total_counted, k.difference
          FROM cash_cut_counts k
          JOIN cash_cut_periods p ON p.id = k.cut_period_id
          JOIN cash_operational_days d ON d.id = p.operational_day_id
          WHERE k.is_current AND p.status = 'FINALIZADO' AND k.created_at <= v_anchor.opened_at
        ) x ORDER BY x.at DESC LIMIT 1;

        INSERT INTO cash_opening_counts (
          count_id, day_opening_id, business_date, previous_close_balance, movements_since_opening,
          previous_count_source, previous_count_id, previous_count_label, previous_count_at,
          previous_counted, previous_difference, difference, difference_reason, responsible, created_by
        ) VALUES (
          v_count_id, v_anchor.day_opening_id, v_anchor.business_date,
          cash_balance_at(v_anchor.opening_sequence),
          (SELECT count(*) FROM cash_movements m WHERE m.direction <> 'NONE'
             AND m.sequence > v_anchor.opening_sequence AND m.sequence <= v_count.last_cash_sequence),
          v_previous.source, v_previous.id, v_previous.label, v_previous.at,
          v_previous.counted, v_previous.difference,
          v_count.difference,
          CASE WHEN v_count.difference = 0 THEN NULLIF(btrim(p_reason), '') ELSE btrim(p_reason) END,
          CASE WHEN v_count.difference = 0 THEN NULLIF(btrim(p_responsible), '') ELSE btrim(p_responsible) END,
          p_user_id
        );
        RETURN v_count_id;
      END;
      $$
    `);

    await queryRunner.query(`
      -- Documented, authorized closing of an arqueo difference (admins). Optionally
      -- registers — in the same transaction — the AJUSTE to the caja Kardex for
      -- exactly the counted difference. Never edits the count or any movement.
      CREATE FUNCTION resolve_cash_count_difference(
        p_source VARCHAR,
        p_count_id UUID,
        p_cause VARCHAR,
        p_explanation VARCHAR,
        p_with_adjustment BOOLEAN,
        p_user_id UUID,
        p_idempotency_key VARCHAR
      ) RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_existing UUID;
        v_id UUID := gen_random_uuid();
        v_label VARCHAR;
        v_difference NUMERIC(14,2);
        v_valid BOOLEAN;
        v_adjustment UUID;
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_existing FROM cash_difference_resolutions WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;
        IF p_explanation IS NULL OR length(btrim(p_explanation)) < 10 THEN
          RAISE EXCEPTION 'CASH_RESOLUTION_EXPLANATION_REQUIRED';
        END IF;
        IF p_cause IS NULL OR p_cause NOT IN ('ERROR_REGISTRO', 'ERROR_CALCULO', 'MOVIMIENTO_DUPLICADO',
             'MOVIMIENTO_OMITIDO', 'DIFERENCIA_ARQUEO', 'INCONSISTENCIA_HISTORICA', 'NO_DETERMINADA') THEN
          RAISE EXCEPTION 'CASH_RESOLUTION_INVALID_CAUSE';
        END IF;

        PERFORM pg_advisory_xact_lock(hashtext('cash_resolution:' || p_source || ':' || p_count_id));
        IF p_source = 'ARQUEO_CAJA' THEN
          SELECT 'Arqueo de Caja #' || number, difference, status = 'VIGENTE'
            INTO v_label, v_difference, v_valid FROM cash_counts WHERE id = p_count_id;
        ELSIF p_source = 'CORTE' THEN
          SELECT 'Corte ' || p.period_number || ' · ' || to_char(d.operational_date, 'DD/MM/YYYY'),
                 k.difference, k.is_current AND p.status = 'FINALIZADO'
            INTO v_label, v_difference, v_valid
          FROM cash_cut_counts k
          JOIN cash_cut_periods p ON p.id = k.cut_period_id
          JOIN cash_operational_days d ON d.id = p.operational_day_id
          WHERE k.id = p_count_id;
        ELSIF p_source = 'ARQUEO_BODEGA' THEN
          SELECT 'Arqueo de Bodega #' || number, difference, TRUE
            INTO v_label, v_difference, v_valid FROM warehouse_cash_audits WHERE id = p_count_id;
        ELSE
          RAISE EXCEPTION 'CASH_COUNT_NOT_FOUND';
        END IF;
        IF v_label IS NULL THEN
          RAISE EXCEPTION 'CASH_COUNT_NOT_FOUND';
        END IF;
        IF NOT v_valid THEN
          RAISE EXCEPTION 'CASH_COUNT_ALREADY_REPLACED';
        END IF;
        IF v_difference = 0 THEN
          RAISE EXCEPTION 'CASH_COUNT_NO_DIFFERENCE';
        END IF;
        IF EXISTS (SELECT 1 FROM cash_difference_resolutions WHERE count_source = p_source AND count_id = p_count_id) THEN
          RAISE EXCEPTION 'CASH_DIFFERENCE_ALREADY_RESOLVED';
        END IF;

        IF COALESCE(p_with_adjustment, FALSE) THEN
          IF p_source = 'ARQUEO_BODEGA' THEN
            RAISE EXCEPTION 'CASH_RESOLUTION_ADJUSTMENT_NOT_AVAILABLE';
          END IF;
          -- Authorized adjustment for exactly the counted difference: a faltante
          -- leaves the Kardex (OUT), a sobrante enters it (IN).
          v_adjustment := apply_cash_movement(
            'AJUSTE', CASE WHEN v_difference < 0 THEN 'OUT' ELSE 'IN' END, abs(v_difference), p_user_id,
            left('Ajuste autorizado por ' || v_label || ' — ' || btrim(p_explanation), 255),
            'CASH_COUNT', p_count_id, NULL, left(btrim(p_explanation), 255), NULL,
            'RES-ADJ:' || p_idempotency_key
          );
        END IF;

        INSERT INTO cash_difference_resolutions (
          id, count_source, count_id, count_label, difference, cause, explanation,
          adjustment_movement_id, idempotency_key, created_by
        ) VALUES (
          v_id, p_source, p_count_id, v_label, v_difference, p_cause, btrim(p_explanation),
          v_adjustment, p_idempotency_key, p_user_id
        );
        RETURN v_id;
      END;
      $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Only objects created by this migration.
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS resolve_cash_count_difference(VARCHAR, UUID, VARCHAR, VARCHAR, BOOLEAN, UUID, VARCHAR)`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_cash_opening_count(JSONB, VARCHAR, VARCHAR, VARCHAR, UUID, VARCHAR)`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS cash_difference_resolutions`);
    await queryRunner.query(`DROP TABLE IF EXISTS cash_opening_counts`);
  }
}
