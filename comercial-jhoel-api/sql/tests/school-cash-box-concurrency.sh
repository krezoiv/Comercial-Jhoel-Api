#!/usr/bin/env bash
# Caja de Listas Escolares — concurrencia (migración 1760008700000).
# Una lista recibe una transferencia de Q500 y, desde sesiones reales y a la vez:
#   - A: traslada Q400 de ese pago y retiene sus locks 2 s,
#   - B: traslada Q400 del mismo pago (juntos superan lo pendiente),
#   - C1/C2: el mismo traslado de Q50 enviado dos veces (misma llave),
#   - D: tres pagos en efectivo de Q10 en paralelo (el saldo del Kardex se lee bajo lock).
# Resultado esperado: entra un solo traslado de Q400, el repetido se registra una
# vez, nunca se traslada más de lo recibido, el banco nunca queda bajo 0 y la
# cadena de saldos del Kardex no tiene huecos.
#
# Necesita datos confirmados en varias sesiones, así que NUNCA corre sobre la
# base real: clona la base, prueba ahí y elimina solo esa copia temporal.
#
#   DB_USER=kzi DB_NAME=comercial_jhoel sql/tests/school-cash-box-concurrency.sh
set -euo pipefail

DB_USER="${DB_USER:-kzi}"
DB_NAME="${DB_NAME:-comercial_jhoel}"
TEST_DB="${DB_NAME}_qa_school_cash_concurrency"
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
  WHERE r.name IN ('SUPER_ADMIN','ADMIN') AND u.is_active ORDER BY u.created_at LIMIT 1")
BANK_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT id FROM banks WHERE is_active AND special_account IS NULL ORDER BY name, id LIMIT 1")
QUOTE_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT create_school_quotation(
    '{\"grade\":\"Primero Básico\",\"customerName\":\"Prueba Caja\",\"customerPhone\":\"5555-0000\",
      \"items\":[{\"productName\":\"Paquete de útiles\",\"quantity\":1,\"unitPrice\":1000}]}'::jsonb,
    '$ADMIN_ID', 'CASH-CONC-QUOTE-1')")
PAYMENT_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT register_school_quotation_payment('$QUOTE_ID', 500, 'TRANSFERENCIA', '$BANK_ID', 'REF', NULL, '$ADMIN_ID', 'CASH-CONC-PAY-1')")
RECEIPT_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT id FROM school_cash_pending_receipts WHERE payment_id = '$PAYMENT_ID'")

transfer_sql() {
  local key="$1" amount="$2" hold="$3"
  cat <<SQL
BEGIN;
SELECT register_school_cash_transfer('$BANK_ID', '[{"movementId":"$RECEIPT_ID","amount":$amount}]'::jsonb,
                                     NULL, NULL, '$ADMIN_ID', 'CASH-CONC-TRF-$key');
SELECT pg_sleep($hold);
COMMIT;
SQL
}
cash_sql() {
  local key="$1"
  cat <<SQL
SELECT register_school_quotation_payment('$QUOTE_ID', 10, 'EFECTIVO', NULL, NULL, NULL, '$ADMIN_ID', 'CASH-CONC-CASH-$key');
SQL
}

OUT_DIR=$(mktemp -d)
(transfer_sql A 400 2 | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/A" 2>&1 || true) &
sleep 0.5
(transfer_sql B 400 0 | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/B" 2>&1 || true) &
(transfer_sql C 50 0 | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/C1" 2>&1 || true) &
(transfer_sql C 50 0 | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/C2" 2>&1 || true) &
for k in 1 2 3; do (cash_sql "$k" | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/D$k" 2>&1 || true) & done
wait

REJECTED=$(cat "$OUT_DIR"/* | grep -c "SCHOOL_CASH_TRANSFER_EXCEEDS_PENDING" || true)
DEADLOCKS=$(cat "$OUT_DIR"/* | grep -c "deadlock" || true)
rm -rf "$OUT_DIR"
RESULT=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT (SELECT count(*) FROM school_cash_transfers WHERE amount = 400) || ' '
      || (SELECT count(*) FROM school_cash_transfers WHERE amount = 50) || ' '
      || (SELECT transferred || '/' || pending FROM school_cash_pending_receipts WHERE id = '$RECEIPT_ID') || ' '
      || school_cash_balance() || ' '
      || (SELECT count(*) FROM (SELECT balance_before, lag(balance_after) OVER (ORDER BY sequence) AS prev
                                  FROM school_cash_movements) t WHERE prev IS NOT NULL AND prev <> balance_before) || ' '
      || (SELECT (final_balance >= 0)::TEXT FROM banks WHERE id = '$BANK_ID')")

if [ "$RESULT" = "1 1 450.00/50.00 480.00 0 true" ] && [ "$REJECTED" = "1" ] && [ "$DEADLOCKS" = "0" ]; then
  echo "OK  concurrencia Caja de Listas: un solo traslado de Q400, traslado repetido sin duplicar, nunca más de lo recibido, Kardex sin huecos"
else
  echo "FALLÓ concurrencia Caja de Listas: resultado '$RESULT', rechazos $REJECTED, deadlocks $DEADLOCKS (se esperaba '1 1 450.00/50.00 480.00 0 true', 1 y 0)"
  exit 1
fi
