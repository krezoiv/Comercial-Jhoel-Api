#!/usr/bin/env bash
# Regenerates the GENERATED part of docs/codebase-study and docs/flowcharts and
# validates both. Hand-written chapters (01, 02, 06, 07, 09, 10, 11, 13, the root guide and
# diagrams/architecture.mmd + business_flows.mmd) and the hand-written flowcharts
# (any .mmd without the "@generado" header) are never touched.
#
#   DB_USER=kzi DB_NAME=comercial_jhoel docs/codebase-study/tools/run.sh
#
# Requirements: Node, the API's node_modules (for the TypeScript compiler) and
# the dev Postgres from comercial-jhoel-api/docker-compose.yml running. The
# schema is read inside a READ ONLY transaction; source files are only read.
set -euo pipefail

TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$TOOLS/../../.." && pwd)"
DOCS="$ROOT/docs/codebase-study"
DB_USER="${DB_USER:-kzi}"
DB_NAME="${DB_NAME:-comercial_jhoel}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

if [ ! -d "$ROOT/comercial-jhoel-api/node_modules/typescript" ]; then
  echo "Falta comercial-jhoel-api/node_modules (ejecuta npm install en comercial-jhoel-api)." >&2
  exit 1
fi

echo "1/6 Analizando el código TypeScript…"
node "$TOOLS/extract.js" "$ROOT" "$WORK/model.json"

echo "2/6 Leyendo el esquema de PostgreSQL (solo lectura)…"
(cd "$ROOT/comercial-jhoel-api" && docker compose exec -T postgres \
  psql -U "$DB_USER" -d "$DB_NAME" -At -v ON_ERROR_STOP=1) < "$TOOLS/schema.sql" > "$WORK/db.json"

echo "3/6 Generando la referencia…"
# Remove only generated folders, so a deleted module/table leaves no stale page.
rm -rf "$DOCS/reference" "$DOCS/index" "$DOCS/database"
node "$TOOLS/render.js" "$ROOT" "$WORK/model.json" "$WORK/db.json"

echo "4/6 Validando la guía de estudio (enlaces, rutas, símbolos y Mermaid)…"
node "$TOOLS/validate.js" "$ROOT" "$WORK/model.json"

echo "5/6 Generando los diagramas de flujo (docs/flowcharts)…"
node "$TOOLS/flowcharts.js" "$ROOT" "$WORK/model.json" "$WORK/db.json"

echo "6/6 Validando los diagramas de flujo…"
node "$TOOLS/validate-flowcharts.js" "$ROOT" "$WORK/model.json" "$WORK/db.json"

echo "Listo. Cifras: $(cat "$WORK/stats.json" | tr -d '\n ')"
echo "Revisa las cifras citadas en los capítulos escritos a mano (guía principal, 13_FINDINGS.md) si cambiaron."
