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

# ── Abastecimiento (migración 1760008300000): dos listas piden 8 unidades de un
# producto con 0 en Bodega (−16 y 16 pendientes). Dos compras de 10 llegan a la
# vez: la asignación FIFO automática debe dar exactamente 16 (nunca más de lo
# pendiente), sin asignar las mismas unidades dos veces, y dejar 4 libres.
PRODUCT_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT id FROM products WHERE is_active ORDER BY created_at LIMIT 1")
SUPPLIER_ID=$("${PSQL[@]}" -d "$TEST_DB" -c "SELECT id FROM suppliers WHERE is_active ORDER BY created_at LIMIT 1")
"${PSQL[@]}" -d "$TEST_DB" >/dev/null <<SQL
SELECT ensure_inventory_stock_row('$PRODUCT_ID', (SELECT id FROM inventory_locations WHERE name = 'Bodega'));
UPDATE inventory_stock SET quantity = 0
 WHERE product_id = '$PRODUCT_ID' AND location_id = (SELECT id FROM inventory_locations WHERE name = 'Bodega');
UPDATE products SET stock = (SELECT SUM(quantity) FROM inventory_stock WHERE product_id = '$PRODUCT_ID') WHERE id = '$PRODUCT_ID';
UPDATE school_supply_settings SET allocation_mode = 'FIFO_AUTO' WHERE id = 1;
SELECT create_school_quotation(
  '{"grade":"Primero Básico","customerName":"Prueba Abastecimiento","customerPhone":"5555-0000",
    "items":[{"productId":"$PRODUCT_ID","productName":"Producto","quantity":8,"unitPrice":1}]}'::jsonb,
  '$USER_ID', 'CONC-SUP-LIST-1');
SELECT create_school_quotation(
  '{"grade":"Primero Básico","customerName":"Prueba Abastecimiento","customerPhone":"5555-0000",
    "items":[{"productId":"$PRODUCT_ID","productName":"Producto","quantity":8,"unitPrice":1}]}'::jsonb,
  '$USER_ID', 'CONC-SUP-LIST-2');
SQL

purchase_sql() {
  local hold="$1"
  cat <<SQL
BEGIN;
SELECT confirm_purchase('$SUPPLIER_ID', '$USER_ID', now(),
  '[{"productId":"$PRODUCT_ID","quantity":10,"costPrice":1,"publicPrice":1}]'::jsonb);
SELECT pg_sleep($hold);
COMMIT;
SQL
}
(purchase_sql 2 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
sleep 0.5
(purchase_sql 0 | "${PSQL[@]}" -d "$TEST_DB" >/dev/null 2>&1 || true) &
wait
SUPPLY=$("${PSQL[@]}" -d "$TEST_DB" -c "
  SELECT (SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
           WHERE s.product_id = '$PRODUCT_ID' AND l.name = 'Bodega') || ' ' ||
         (SELECT COALESCE(SUM(quantity), 0) FROM school_supply_allocations a JOIN school_quotations q ON q.id = a.quotation_id
           WHERE q.idempotency_key LIKE 'CONC-SUP-LIST-%' AND a.status = 'ASIGNADA') || ' ' ||
         (SELECT COALESCE(SUM(pending), 0) FROM school_supply_commitments c JOIN school_quotations q ON q.id = c.quotation_id
           WHERE q.idempotency_key LIKE 'CONC-SUP-LIST-%') || ' ' ||
         school_supply_free_units('$PRODUCT_ID') || ' ' ||
         (SELECT count(*) FROM (SELECT source_movement_id, SUM(quantity) s FROM school_supply_allocations
                                 WHERE source_movement_id IS NOT NULL GROUP BY 1
                                HAVING SUM(quantity) > 10) x)")
if [ "$SUPPLY" = "4 16 0 4 0" ]; then
  echo "OK  concurrencia abastecimiento: dos compras simultáneas, 16 asignadas sin duplicar, 4 libres"
else
  echo "FALLÓ concurrencia abastecimiento: '$SUPPLY' (se esperaba '4 16 0 4 0': Bodega, asignadas, pendientes, libres, compras sobreasignadas)"
  exit 1
fi
