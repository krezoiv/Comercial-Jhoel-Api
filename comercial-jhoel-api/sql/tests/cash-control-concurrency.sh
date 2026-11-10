#!/usr/bin/env bash
# Control de Efectivo — concurrencia (prueba 22). Diez sesiones reales registran
# movimientos de efectivo al mismo tiempo; la sesión A retiene el lock 2 s.
# `apply_cash_movement` serializa con `pg_advisory_xact_lock('cash_control_main')`
# y lee el saldo anterior bajo ese lock, así que:
#   - la cadena saldo_anterior → saldo_posterior debe ser continua,
#   - el saldo final debe ser exactamente base + suma de todos los montos,
#   - ningún movimiento se pierde ni se duplica.
#
# Necesita datos confirmados en varias sesiones, así que NUNCA corre sobre la
# base real: clona la base (pg_dump → base temporal), prueba ahí y elimina
# solo esa copia temporal al terminar.
#
#   DB_USER=kzi DB_NAME=comercial_jhoel sql/tests/cash-control-concurrency.sh
set -euo pipefail

DB_USER="${DB_USER:-kzi}"
DB_NAME="${DB_NAME:-comercial_jhoel}"
TEST_DB="${DB_NAME}_qa_cash_concurrency"
PSQL=(docker compose exec -T postgres psql -U "$DB_USER" -v ON_ERROR_STOP=1 -qAt)

cleanup() {
  docker compose exec -T postgres dropdb -U "$DB_USER" --if-exists "$TEST_DB" >/dev/null 2>&1 || true
}
trap cleanup EXIT

cleanup
docker compose exec -T postgres createdb -U "$DB_USER" "$TEST_DB"
docker compose exec -T postgres sh -c "pg_dump -U '$DB_USER' '$DB_NAME' | psql -q -U '$DB_USER' '$TEST_DB'" >/dev/null

ADMIN_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN','ADMIN') ORDER BY u.created_at LIMIT 1")
BASE=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT cash_balance()")
START_SEQ=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT COALESCE(max(sequence), 0) FROM cash_movements")

movement_sql() {
  local key="$1" type="$2" amount="$3" hold="$4"
  cat <<SQL
BEGIN;
SELECT register_manual_cash_movement('$type', $amount, '$ADMIN_ID', NULL, 'Prueba de concurrencia', 'CONC:$key');
SELECT pg_sleep($hold);
COMMIT;
SQL
}

# A: entrada de Q100 que retiene el lock 2 s. Las demás arrancan mientras tanto.
(movement_sql A ENTRADA_MANUAL 100 2 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null) &
sleep 0.5
for i in 1 2 3 4 5 6 7 8 9; do
  if (( i % 3 == 0 )); then
    (movement_sql "B$i" SALIDA_MANUAL 30 0 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null) &
  else
    (movement_sql "B$i" ENTRADA_MANUAL 50 0 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null) &
  fi
done
# Reintento del mismo request (misma llave): no debe duplicar.
(movement_sql B1 ENTRADA_MANUAL 50 0 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null) &
wait

EXPECTED=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT ($BASE + 100 + 6 * 50 - 3 * 30)::numeric(14,2)")
FINAL=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT cash_balance()::numeric(14,2)")
ROWS=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT count(*) FROM cash_movements WHERE sequence > $START_SEQ")
BROKEN=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT count(*) FROM (
    SELECT previous_balance, lag(new_balance) OVER (ORDER BY sequence) AS prior FROM cash_movements
  ) k WHERE prior IS NOT NULL AND prior <> previous_balance")

echo "Saldo final: $FINAL (esperado $EXPECTED) · movimientos nuevos: $ROWS (esperado 10) · eslabones rotos: $BROKEN"
if [[ "$FINAL" == "$EXPECTED" && "$ROWS" == "10" && "$BROKEN" == "0" ]]; then
  echo "OK  concurrencia: saldo exacto, sin duplicados, cadena continua"
else
  echo "FALLÓ concurrencia"
  exit 1
fi
