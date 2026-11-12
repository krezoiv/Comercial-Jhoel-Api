# Herramientas de la guía de estudio

Scripts que generan y validan la **parte generada** de `docs/codebase-study/`. Solo leen el código y la base de datos; nunca modifican el proyecto.

## Uso

Desde la raíz del repositorio, con el Postgres de desarrollo levantado (`docker compose up -d` en `comercial-jhoel-api`) y `npm install` hecho en `comercial-jhoel-api`:

```bash
DB_USER=<usuario> DB_NAME=<base> docs/codebase-study/tools/run.sh
```

`DB_USER` y `DB_NAME` toman por defecto los valores de desarrollo usados en este proyecto.

## Qué hace cada archivo

| Archivo | Función |
|---|---|
| `run.sh` | Ejecuta los seis pasos en orden (extraer, esquema, referencia, validar, diagramas, validar diagramas). Usa una carpeta temporal para los JSON intermedios y la borra al terminar. |
| `extract.js` | Analiza cada `.ts` con el compilador de TypeScript (solo sintaxis) y cada plantilla HTML. Obtiene clases, métodos (firma, líneas, JSDoc, llamadas, errores, SQL, HTTP), funciones, interfaces, imports y selectores. Produce `model.json`. |
| `schema.sql` | Consulta de **solo lectura** (`BEGIN READ ONLY … ROLLBACK`) que exporta tablas, columnas, restricciones, índices, triggers, funciones (con sus condiciones `IF … THEN RAISE EXCEPTION`) y migraciones como una línea JSON (`db.json`). |
| `render.js` | Con `model.json` y `db.json` escribe `00_FILE_INVENTORY.md`, `03_BACKEND_REFERENCE.md`, `04_FRONTEND_REFERENCE.md`, `05_DATABASE_REFERENCE.md`, `08_FILE_DEPENDENCIES.md`, `12_API_ENDPOINTS.md`, `reference/`, `index/`, `database/`, `diagrams/module_dependencies.mmd` y `diagrams/database_relationships.mmd`. |
| `lib.js` | Análisis compartido para los diagramas: endpoints, cadenas controlador → caso de uso → puerto → implementación → SQL, llamadores del frontend (por propiedades inyectadas) y decisiones reales (`if … throw` y `IF … RAISE EXCEPTION`). |
| `flowcharts.js` | Genera `docs/flowcharts/`: un mapa por controlador, un flujo de decisiones por cada endpoint que escribe, secuencias de los procesos clave, ER y uso de tablas, dependencias entre módulos, escritores de saldos, un `.md` por cada `.mmd` y el `README.md` índice. Antes borra solo los diagramas que tienen la marca `@generado`. |
| `validate-flowcharts.js` | Valida `docs/flowcharts/`: sintaxis estructural de Mermaid (flowchart, sequence, ER), rutas de `@archivos`, nombres `Clase.metodo`, funciones SQL y tablas contra el esquema, y enlaces. |
| `validate.js` | Revisa enlaces y anclas, que existan las rutas y los nombres de clases y métodos citados en los capítulos escritos a mano, y la sintaxis estructural de los diagramas Mermaid. |

## Qué NO regenera

Los capítulos escritos a mano no se tocan, tampoco los diagramas de `docs/flowcharts` sin la marca `@generado`:

- `CODEBASE_STUDY_GUIDE.md` (raíz)
- `01`, `02`, `06`, `07`, `09`, `10`, `11`, `13`
- `diagrams/architecture.mmd` y `diagrams/business_flows.mmd`

Si el código cambia, puede que tengas que actualizarlos a mano. `validate.js` avisa cuando citan una ruta, una clase o un método que ya no existe. Las cifras de la guía principal y de `13_FINDINGS.md` también se actualizan a mano; `run.sh` imprime las nuevas al final.

## Limitaciones

Las describe [13_FINDINGS.md §6](../13_FINDINGS.md#6-limitaciones-del-análisis-automático):

- El análisis es sintáctico, sin verificador de tipos.
- Los consumidores de un método se aproximan por el nombre de la llamada.
- Las tablas se detectan con expresiones regulares sobre el SQL.
- La validación de Mermaid es estructural, no usa el parser oficial.
