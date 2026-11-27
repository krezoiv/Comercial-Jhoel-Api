#!/usr/bin/env bash
# Pagos grupales — concurrencia (prueba 22, migración 1760009400000). Sesiones
# reales compiten a la vez:
#   1. dos usuarios confirman la MISMA transacción con solicitudes distintas:
#      una sola entrega, una sola salida de Caja;
#   2. dos grupos intentan reservar el mismo dinero: solo uno se crea;
#   3. una salida manual compite con una entrega por el dinero reservado: la
#      entrega pasa, la salida se rechaza y la Caja nunca toma lo reservado;
#   4. (migración 1760009500000) dos administradores aprueban el MISMO grupo de
#      Préstamos Génesis a la vez, con solicitudes distintas: las cuotas se
#      contabilizan una sola vez.
#
# Necesita datos confirmados en varias sesiones, así que NUNCA corre sobre la
# base real: clona la base (pg_dump → base temporal), prueba ahí y elimina
# solo esa copia temporal al terminar.
#
#   DB_USER=kzi DB_NAME=comercial_jhoel sql/tests/payment-groups-concurrency.sh
set -euo pipefail

DB_USER="${DB_USER:-kzi}"
DB_NAME="${DB_NAME:-comercial_jhoel}"
TEST_DB="${DB_NAME}_qa_payment_groups"
PSQL=(docker compose exec -T postgres psql -U "$DB_USER" -v ON_ERROR_STOP=1 -qAt)

cleanup() {
  docker compose exec -T postgres dropdb -U "$DB_USER" --if-exists "$TEST_DB" >/dev/null 2>&1 || true
}
trap cleanup EXIT

cleanup
docker compose exec -T postgres createdb -U "$DB_USER" "$TEST_DB"
docker compose exec -T postgres sh -c "pg_dump -U '$DB_USER' '$DB_NAME' | psql -q -U '$DB_USER' '$TEST_DB'" >/dev/null

q() { "${PSQL[@]}" -d "$TEST_DB" -c "$1"; }

ADMIN_ID=$(q "SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name IN ('SUPER_ADMIN','ADMIN') ORDER BY u.created_at LIMIT 1")
AGENT_ID=$(q "SELECT id FROM transaction_banks WHERE cash_box_code IS NULL AND is_active ORDER BY created_at LIMIT 1")
TYPE_ID=$(q "INSERT INTO transaction_types (name, icon, cash_effect, allows_group_payment, created_by) VALUES ('Pago Varios (concurrencia)', 'wallet', 'OUT', true, '$ADMIN_ID') RETURNING id" | head -1)
# Caja con Q1,000 disponibles exactos (sin otras reservas en la copia).
q "SELECT apply_cash_movement('AJUSTE', CASE WHEN cash_available() < 1000 THEN 'IN' ELSE 'OUT' END, abs(1000 - cash_available()), '$ADMIN_ID', 'Base concurrencia', NULL, NULL, NULL, 'Prueba', NULL, 'CONC:PG:BASE') WHERE cash_available() <> 1000" >/dev/null

# 1. La misma transacción, dos usuarios a la vez.
GROUP_ID=$(q "SELECT create_payment_group('$TYPE_ID', 'Grupo concurrencia', '$AGENT_ID', NULL, 600, '[{\"expectedAmount\": 500}]'::jsonb, NULL, '$ADMIN_ID', 'CONC:PG:G1')")
ITEM_ID=$(q "SELECT id FROM payment_group_items WHERE group_id = '$GROUP_ID'")
CASH_BEFORE=$(q "SELECT cash_balance()::numeric(14,2)")
deliver_sql() {
  cat <<SQL
BEGIN;
SELECT register_payment_group_delivery('$GROUP_ID', '$ITEM_ID', 500, NULL, '$ADMIN_ID', 'CONC:PG:D:$1');
SELECT pg_sleep($2);
COMMIT;
SQL
}
(deliver_sql X 2 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
sleep 0.5
(deliver_sql Y 0 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
wait
DELIVERIES=$(q "SELECT count(*) FROM payment_group_deliveries WHERE item_id = '$ITEM_ID'")
CASH_AFTER=$(q "SELECT cash_balance()::numeric(14,2)")
CASH_EXPECTED=$(q "SELECT ($CASH_BEFORE - 500)::numeric(14,2)")
echo "1. entregas $DELIVERIES (esperado 1) · caja $CASH_AFTER (esperado $CASH_EXPECTED)"
[[ "$DELIVERIES" == "1" && "$CASH_AFTER" == "$CASH_EXPECTED" ]] || { echo "FALLÓ concurrencia: misma transacción"; exit 1; }

# 2. Dos grupos por el mismo dinero (disponible: Q400 — Q1,000 − Q600 reservados; cada uno pide Q300).
AVAILABLE=$(q "SELECT cash_available()::numeric(14,2)")
create_sql() {
  cat <<SQL
BEGIN;
SELECT create_payment_group('$TYPE_ID', 'Grupo $1', '$AGENT_ID', NULL, 300, '[{"expectedAmount": 300}]'::jsonb, NULL, '$ADMIN_ID', 'CONC:PG:C:$1');
SELECT pg_sleep($2);
COMMIT;
SQL
}
(create_sql A 2 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
sleep 0.5
(create_sql B 0 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
wait
CREATED=$(q "SELECT count(*) FROM payment_groups WHERE idempotency_key IN ('CONC:PG:C:A', 'CONC:PG:C:B')")
NEGATIVE=$(q "SELECT (cash_available() < 0)::text")
echo "2. disponible antes $AVAILABLE · grupos creados $CREATED (esperado 1) · disponible negativo: $NEGATIVE"
[[ "$CREATED" == "1" && "$NEGATIVE" == "false" ]] || { echo "FALLÓ concurrencia: doble reserva"; exit 1; }

# 3. Salida manual contra una entrega del dinero reservado (disponible = Q100).
GROUP3=$(q "SELECT id FROM payment_groups WHERE idempotency_key IN ('CONC:PG:C:A', 'CONC:PG:C:B')")
ITEM3=$(q "SELECT id FROM payment_group_items WHERE group_id = '$GROUP3'")
RESERVED_BEFORE=$(q "SELECT cash_reserved_total()::numeric(14,2)")
(printf "BEGIN;\nSELECT register_payment_group_delivery('%s', '%s', 300, NULL, '%s', 'CONC:PG:D3');\nSELECT pg_sleep(2);\nCOMMIT;\n" "$GROUP3" "$ITEM3" "$ADMIN_ID" | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
sleep 0.5
(printf "SELECT register_manual_cash_movement('SALIDA_MANUAL', 400, '%s', NULL, 'Compite con el grupo', 'CONC:PG:OUT');\n" "$ADMIN_ID" | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
wait
OUT_ROWS=$(q "SELECT count(*) FROM cash_movements WHERE idempotency_key = 'CONC:PG:OUT'")
D3=$(q "SELECT count(*) FROM payment_group_deliveries WHERE idempotency_key = 'CONC:PG:D3'")
RESERVED_AFTER=$(q "SELECT cash_reserved_total()::numeric(14,2)")
CONSISTENT=$(q "SELECT (cash_available() = cash_balance() - cash_reserved_total() AND cash_available() >= 0)::text")
echo "3. entrega $D3 (esperado 1) · salida de Q400 aplicada $OUT_ROWS (esperado 0) · reservado $RESERVED_BEFORE → $RESERVED_AFTER · consistente: $CONSISTENT"
[[ "$D3" == "1" && "$OUT_ROWS" == "0" && "$CONSISTENT" == "true" ]] || { echo "FALLÓ concurrencia: salida contra reserva"; exit 1; }

# 4. Aprobación doble de un grupo Génesis (3 cuotas, Q900).
GENESIS_TYPE=$(q "SELECT id FROM transaction_types WHERE balance_effect = 'PAGO_GENESIS' AND is_active ORDER BY created_at LIMIT 1")
if [[ -n "$GENESIS_TYPE" ]]; then
  q "UPDATE transaction_types SET allows_group_payment = true WHERE id = '$GENESIS_TYPE'" >/dev/null
  q "SELECT adjust_bank_balance(id, 0, CURRENT_DATE, '$ADMIN_ID', 'Base concurrencia', NULL) FROM banks WHERE special_account = 'GENESIS' AND is_active AND final_balance <> 0" >/dev/null
  GROUP4=$(q "SELECT create_payment_group('$GENESIS_TYPE', 'EL GOLFO concurrencia', NULL, NULL, 900, '[{\"expectedAmount\": 300, \"creditNumber\": \"C1\", \"reference\": \"Ana\"}, {\"expectedAmount\": 300, \"creditNumber\": \"C2\", \"reference\": \"Beto\"}, {\"expectedAmount\": 300, \"creditNumber\": \"C3\", \"reference\": \"Ceci\"}]'::jsonb, NULL, '$ADMIN_ID', 'CONC:PG:G4')")
  CASH4=$(q "SELECT cash_balance()::numeric(14,2)")
  approve_sql() {
    cat <<SQL
BEGIN;
SELECT approve_payment_group('$GROUP4', 900, 3, '$ADMIN_ID', 'CONC:PG:A:$1');
SELECT pg_sleep($2);
COMMIT;
SQL
  }
  (approve_sql X 2 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
  sleep 0.5
  (approve_sql Y 0 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
  wait
  OPS4=$(q "SELECT count(*) FROM payment_group_deliveries WHERE group_id = '$GROUP4'")
  APPROVALS=$(q "SELECT count(*) FROM payment_group_events WHERE group_id = '$GROUP4' AND event_type = 'APROBACION'")
  STATUS4=$(q "SELECT display_status FROM payment_group_balances WHERE id = '$GROUP4'")
  CASH4_AFTER=$(q "SELECT (cash_balance() - $CASH4)::numeric(14,2)")
  echo "4. cuotas contabilizadas $OPS4 (esperado 3) · aprobaciones $APPROVALS (esperado 1) · $STATUS4 · Caja +$CASH4_AFTER (esperado +900.00)"
  [[ "$OPS4" == "3" && "$APPROVALS" == "1" && "$STATUS4" == "APROBADO" && "$CASH4_AFTER" == "900.00" ]] || { echo "FALLÓ concurrencia: aprobación doble"; exit 1; }
else
  echo "4. SKIP (sin tipo Pago Préstamos Génesis)"
fi

BROKEN=$(q "SELECT count(*) FROM (SELECT previous_balance, lag(new_balance) OVER (ORDER BY sequence) AS prior FROM cash_movements) k WHERE prior IS NOT NULL AND prior <> previous_balance")
[[ "$BROKEN" == "0" ]] || { echo "FALLÓ cadena del Kardex"; exit 1; }
echo "OK  concurrencia pagos grupales: una entrega por transacción, sin doble reserva, la reserva no se toca, una sola aprobación"
