#!/usr/bin/env bash
# Runs test/cash-control.e2e-spec.ts (HTTP, full AppModule) against a TEMPORARY
# clone of the dev database — the Kardex is append-only, so the e2e flow must
# never write to the real database. Clones (pg_dump → <db>_e2e), runs jest
# inside the api container pointed at the clone, then drops only the clone.
#
#   DB_USER=kzi DB_NAME=comercial_jhoel test/run-cash-control-e2e.sh [spec ...]
#
# With no argument it runs test/cash-control.e2e-spec.ts; pass other specs that
# also write financial data (e.g. test/ar-settlements.e2e-spec.ts) to run them
# against the same disposable clone.
set -euo pipefail

SPECS=("$@")
if [ ${#SPECS[@]} -eq 0 ]; then
  SPECS=(test/cash-control.e2e-spec.ts)
fi

DB_USER="${DB_USER:-kzi}"
DB_NAME="${DB_NAME:-comercial_jhoel}"
TEST_DB="${DB_NAME}_e2e"

cleanup() {
  docker compose exec -T postgres dropdb -U "$DB_USER" --if-exists "$TEST_DB" >/dev/null 2>&1 || true
}
trap cleanup EXIT

cleanup
docker compose exec -T postgres createdb -U "$DB_USER" "$TEST_DB"
docker compose exec -T postgres sh -c "pg_dump -U '$DB_USER' '$DB_NAME' | psql -q -U '$DB_USER' '$TEST_DB'" >/dev/null

docker compose exec -T -e DATABASE_NAME="$TEST_DB" api \
  npx jest --config test/jest-e2e.json --runInBand "${SPECS[@]}"
