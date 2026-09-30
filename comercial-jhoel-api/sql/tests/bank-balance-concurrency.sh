#!/usr/bin/env bash
# CASO 20 — concurrencia. Dos sesiones reales intentan depositar sobre la
# misma cuenta con saldo Q1,000: A deposita Q700 y B deposita Q500 al mismo
# tiempo. `apply_bank_account_movement` bloquea la fila de `banks` con
# SELECT ... FOR UPDATE, así que B espera a que A confirme y luego ve el saldo
# real (Q300): B debe ser rechazado y el saldo final debe ser exactamente Q300.
#
# Necesita datos confirmados en dos sesiones, así que NUNCA corre sobre la
# base real: clona la base (pg_dump → base temporal), prueba ahí y elimina
# solo esa copia temporal al terminar.
#
#   DB_USER=kzi DB_NAME=comercial_jhoel sql/tests/bank-balance-concurrency.sh
set -euo pipefail

DB_USER="${DB_USER:-kzi}"
DB_NAME="${DB_NAME:-comercial_jhoel}"
TEST_DB="${DB_NAME}_qa_concurrency"
PSQL=(docker compose exec -T postgres psql -U "$DB_USER" -v ON_ERROR_STOP=1 -qAt)

cleanup() {
  docker compose exec -T postgres dropdb -U "$DB_USER" --if-exists "$TEST_DB" >/dev/null 2>&1 || true
}
LOG_A="$(mktemp)"
LOG_B="$(mktemp)"
trap 'cleanup; rm -f "$LOG_A" "$LOG_B"' EXIT

cleanup
docker compose exec -T postgres createdb -U "$DB_USER" "$TEST_DB"
docker compose exec -T postgres sh -c "pg_dump -U '$DB_USER' '$DB_NAME' | psql -q -U '$DB_USER' '$TEST_DB'" >/dev/null

read -r BANK_ID ADMIN_ID TX_BANK_ID TX_TYPE_ID < <("${PSQL[@]}" -d "$TEST_DB" -F ' ' -c "
  SELECT
    (SELECT id FROM banks WHERE is_active AND special_account IS NULL ORDER BY created_at LIMIT 1),
    (SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name IN ('SUPER_ADMIN','ADMIN') ORDER BY u.created_at LIMIT 1),
    (SELECT id FROM transaction_banks WHERE is_active ORDER BY created_at LIMIT 1),
    (SELECT id FROM transaction_types WHERE balance_effect = 'DEPOSITO' AND is_active LIMIT 1)")

"${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT adjust_bank_balance('$BANK_ID', 1000, CURRENT_DATE, '$ADMIN_ID', 'Preparación prueba concurrencia')
  WHERE (SELECT final_balance FROM banks WHERE id = '$BANK_ID') <> 1000" >/dev/null

deposit_sql() {
  local amount="$1" hold="$2"
  cat <<SQL
BEGIN;
SELECT register_bank_deposit_operation('$TX_BANK_ID', $amount, CURRENT_DATE,
  '[{"denomination": $amount, "quantity": 1}]'::jsonb, '[$amount]'::jsonb,
  '$ADMIN_ID', '$TX_TYPE_ID', 'Concurrencia', 0, NULL, '$BANK_ID');
SELECT pg_sleep($hold);
COMMIT;
SQL
}

# A toma el lock y lo retiene 2 s; B arranca 0.5 s después y debe esperar.
(deposit_sql 700 2 | "${PSQL[@]}" -d "$TEST_DB" >"$LOG_A" 2>&1 && echo "A: OK" || echo "A: rechazado — $(grep -m1 ERROR "$LOG_A")") &
sleep 0.5
(deposit_sql 500 0 | "${PSQL[@]}" -d "$TEST_DB" >"$LOG_B" 2>&1 && echo "B: OK" || echo "B: rechazado — $(grep -m1 ERROR "$LOG_B")") &
wait

FINAL=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT final_balance FROM banks WHERE id = '$BANK_ID'")
LEDGER=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT COALESCE(SUM(amount),0) FROM bank_account_movements WHERE bank_id = '$BANK_ID'")
DEPOSITS=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT COUNT(*) FROM bank_deposit_operations WHERE client_name = 'Concurrencia'")

echo "Saldo final: $FINAL | Suma ledger: $LEDGER | Operaciones registradas: $DEPOSITS"
if [[ "$FINAL" == "300.00" && "$LEDGER" == "300.00" && "$DEPOSITS" == "1" ]]; then
  echo "CASO 20 OK — sin doble uso del saldo, sin movimientos perdidos, operación rechazada revertida por completo"
else
  echo "CASO 20 FALLÓ" >&2
  exit 1
fi

# CASO 21 — concurrencia sobre la línea de crédito de BI Club (migración
# 1760005700000 / 1760005800000). BI Club en -Q50,000 (disponible Q25,000),
# Banco Industrial con Q100,000. A y B usan Q20,000 de la línea al mismo
# tiempo (BI Club → Banco Industrial): `register_bank_transfer` bloquea ambas
# filas en orden de id, así que B espera a A, ve -Q70,000 y es rechazado
# (excedería -Q75,000). Final: BI Club -Q70,000, Industrial Q120,000.
read -r IND_ID BICLUB_ID < <("${PSQL[@]}" -d "$TEST_DB" -F ' ' -c "
  SELECT
    (SELECT id FROM banks WHERE is_active AND special_account = 'BANCO_INDUSTRIAL' ORDER BY created_at LIMIT 1),
    (SELECT id FROM banks WHERE is_active AND special_account = 'BI_CLUB' ORDER BY created_at LIMIT 1)")

"${PSQL[@]}" -d "$TEST_DB" -c "
  UPDATE banks SET max_balance = 75000 WHERE id = '$BICLUB_ID';
  SELECT adjust_bank_balance('$IND_ID', 100000, CURRENT_DATE, '$ADMIN_ID', 'Preparación prueba concurrencia')
  WHERE (SELECT final_balance FROM banks WHERE id = '$IND_ID') <> 100000;
  SELECT adjust_bank_balance('$BICLUB_ID', -50000, CURRENT_DATE, '$ADMIN_ID', 'Preparación prueba concurrencia')
  WHERE (SELECT final_balance FROM banks WHERE id = '$BICLUB_ID') <> -50000" >/dev/null

credit_line_sql() {
  local hold="$1"
  cat <<SQL
BEGIN;
SELECT register_bank_transfer('$BICLUB_ID', '$IND_ID', 20000, CURRENT_DATE, '$ADMIN_ID', 'CONC', 'Concurrencia BI Club');
SELECT pg_sleep($hold);
COMMIT;
SQL
}

(credit_line_sql 2 | "${PSQL[@]}" -d "$TEST_DB" >"$LOG_A" 2>&1 && echo "A: OK" || echo "A: rechazado — $(grep -m1 ERROR "$LOG_A")") &
sleep 0.5
(credit_line_sql 0 | "${PSQL[@]}" -d "$TEST_DB" >"$LOG_B" 2>&1 && echo "B: OK" || echo "B: rechazado — $(grep -m1 ERROR "$LOG_B")") &
wait

BICLUB_FINAL=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT final_balance FROM banks WHERE id = '$BICLUB_ID'")
IND_FINAL=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT final_balance FROM banks WHERE id = '$IND_ID'")
TRANSFERS=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT COUNT(*) FROM bank_account_movements WHERE reference_text = 'CONC' AND bank_id = '$BICLUB_ID'")

echo "BI Club: $BICLUB_FINAL | Banco Industrial: $IND_FINAL | Usos registrados: $TRANSFERS"
if [[ "$BICLUB_FINAL" == "-70000.00" && "$IND_FINAL" == "120000.00" && "$TRANSFERS" == "1" ]]; then
  echo "CASO 21 OK — la disponibilidad de la línea no se usó dos veces; el rechazo no movió Banco Industrial"
else
  echo "CASO 21 FALLÓ" >&2
  exit 1
fi
