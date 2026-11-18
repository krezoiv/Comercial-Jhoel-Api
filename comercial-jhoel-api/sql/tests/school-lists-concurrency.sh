#!/usr/bin/env bash
# Listas Escolares — concurrencia de pagos (migración 1760007900000).
# Una cotización de Q100 recibe al mismo tiempo, desde sesiones reales:
#   - A: abono de Q60 que retiene el lock de la cotización 2 s,
#   - B: abono de Q60 (juntos superan el saldo),
#   - C1/C2: el mismo abono de Q10 enviado dos veces (misma llave).
# `register_school_quotation_payment` bloquea la fila de la cotización
# (FOR UPDATE) y calcula el saldo bajo ese lock, así que:
#   - solo uno de los dos abonos de Q60 entra; el otro recibe
#     SCHOOL_PAYMENT_EXCEEDS_BALANCE,
#   - el abono repetido se registra una sola vez,
#   - lo pagado nunca supera el total.
#
# Necesita datos confirmados en varias sesiones, así que NUNCA corre sobre la
# base real: clona la base, prueba ahí y elimina solo esa copia temporal.
#
#   DB_USER=kzi DB_NAME=comercial_jhoel sql/tests/school-lists-concurrency.sh
set -euo pipefail

DB_USER="${DB_USER:-kzi}"
DB_NAME="${DB_NAME:-comercial_jhoel}"
TEST_DB="${DB_NAME}_qa_school_concurrency"
PSQL=(docker compose exec -T postgres psql -U "$DB_USER" -v ON_ERROR_STOP=1 -qAt)

cleanup() {
  docker compose exec -T postgres dropdb -U "$DB_USER" --if-exists "$TEST_DB" >/dev/null 2>&1 || true
}
trap cleanup EXIT

cleanup
docker compose exec -T postgres createdb -U "$DB_USER" "$TEST_DB"
docker compose exec -T postgres sh -c "pg_dump -U '$DB_USER' '$DB_NAME' | psql -q -U '$DB_USER' '$TEST_DB'" >/dev/null

USER_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN','ADMIN') AND u.is_active ORDER BY u.created_at LIMIT 1")
QUOTE_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT create_school_quotation(
    '{\"grade\":\"Primero Básico\",\"customerName\":\"Prueba Concurrencia\",\"customerPhone\":\"5555-0000\",
      \"items\":[{\"productName\":\"Paquete de útiles\",\"quantity\":1,\"unitPrice\":100}]}'::jsonb,
    '$USER_ID', 'CONC-QUOTE-0001')")

payment_sql() {
  local key="$1" amount="$2" hold="$3"
  cat <<SQL
BEGIN;
SELECT register_school_quotation_payment('$QUOTE_ID', $amount, 'EFECTIVO', NULL, NULL, NULL, '$USER_ID', 'CONC-PAY-$key');
SELECT pg_sleep($hold);
COMMIT;
SQL
}

OUT_DIR=$(mktemp -d)
(payment_sql A 60 2 | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/A" 2>&1 || true) &
sleep 0.5
(payment_sql B 60 0 | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/B" 2>&1 || true) &
(payment_sql C 10 0 | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/C1" 2>&1 || true) &
(payment_sql C 10 0 | "${PSQL[@]}" -d "$TEST_DB" >"$OUT_DIR/C2" 2>&1 || true) &
wait

REJECTED=$(cat "$OUT_DIR"/* | grep -c "SCHOOL_PAYMENT_EXCEEDS_BALANCE" || true)
rm -rf "$OUT_DIR"
RESULT=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT count(*) FILTER (WHERE amount = 60) || ' ' || count(*) FILTER (WHERE amount = 10) || ' '
         || school_quotation_paid('$QUOTE_ID') || ' ' || (SELECT total FROM school_quotations WHERE id = '$QUOTE_ID')
    FROM school_quotation_payments WHERE quotation_id = '$QUOTE_ID'")

if [ "$RESULT" = "1 1 70.00 100.00" ] && [ "$REJECTED" = "1" ]; then
  echo "OK  concurrencia Listas Escolares: un solo abono de Q60, abono repetido sin duplicar, pagado nunca supera el total"
else
  echo "FALLÓ concurrencia Listas Escolares: resultado '$RESULT', rechazos $REJECTED (se esperaba '1 1 70.00 100.00' y 1)"
  exit 1
fi
