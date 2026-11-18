# Base de datos — dominio `school-lists`

Volver a [05_DATABASE_REFERENCE.md](../05_DATABASE_REFERENCE.md). Diagrama ER: llaves primarias (PK) y foráneas (FK) reales; las tablas de otros dominios referenciadas aparecen solo con su `id`. Se muestran hasta 14 columnas por tabla en el diagrama; la lista completa está en cada ficha.

```mermaid
erDiagram
  school_dispatch_items {
    uuid id PK
    uuid dispatch_id FK
    uuid product_id FK
    character_varying product_name
    integer requested
    integer supplied
    integer delivered
    boolean inventory_controlled
  }
  school_dispatches {
    uuid id PK
    uuid quotation_id FK
    timestamp_with_time_zone dispatched_at
    uuid dispatched_by FK
    character_varying observations
    character_varying idempotency_key
  }
  school_list_history {
    bigint id PK
    character_varying entity_type
    uuid entity_id
    character_varying action
    character_varying from_status
    character_varying to_status
    jsonb details
    uuid created_by FK
    timestamp_with_time_zone created_at
  }
  school_list_template_items {
    uuid id PK
    uuid template_id FK
    integer line_no
    uuid product_id FK
    character_varying product_name
    character_varying description
    integer quantity
    numeric unit_price
    numeric subtotal
    character_varying observations
  }
  school_list_templates {
    uuid id PK
    character_varying name
    character_varying grade
    character_varying description
    boolean is_active
    integer sort_order
    integer version
    uuid created_by FK
    uuid updated_by FK
    timestamp_with_time_zone created_at
    timestamp_with_time_zone updated_at
  }
  school_quotation_items {
    uuid id PK
    uuid quotation_id FK
    integer line_no
    character_varying source
    uuid template_item_id FK
    uuid product_id FK
    character_varying product_name
    character_varying description
    integer quantity
    numeric unit_price
    numeric discount
    numeric subtotal
    character_varying observations
  }
  school_quotation_payments {
    uuid id PK
    uuid quotation_id FK
    character_varying receipt_number
    character_varying kind
    numeric amount
    character_varying payment_method
    uuid bank_id FK
    character_varying reference
    character_varying observations
    numeric balance_after
    character_varying status
    uuid reversal_of_id FK
    uuid received_by FK
    timestamp_with_time_zone received_at
  }
  school_quotations {
    uuid id PK
    character_varying quotation_number
    uuid template_id FK
    character_varying template_name
    character_varying grade
    character_varying customer_name
    character_varying customer_phone
    character_varying student_name
    date quotation_date
    date delivery_date
    character_varying observations
    numeric subtotal
    numeric discount
    numeric total
  }
  school_supply_allocations {
    uuid id PK
    uuid quotation_id FK
    uuid product_id FK
    integer quantity
    character_varying source_type
    uuid source_movement_id FK
    uuid purchase_id FK
    character_varying mode
    character_varying status
    character_varying idempotency_key
    uuid created_by FK
    timestamp_with_time_zone created_at
    timestamp_with_time_zone released_at
    uuid released_by FK
  }
  school_supply_settings {
    smallint id PK
    character_varying allocation_mode
    uuid updated_by FK
    timestamp_with_time_zone updated_at
  }
  products {
    uuid id PK
  }
  users {
    uuid id PK
  }
  banks {
    uuid id PK
  }
  purchases {
    uuid id PK
  }
  inventory_movements {
    uuid id PK
  }
  school_dispatches ||--o{ school_dispatch_items : "dispatch_id"
  products ||--o{ school_dispatch_items : "product_id"
  users ||--o{ school_dispatches : "dispatched_by"
  school_quotations ||--o{ school_dispatches : "quotation_id"
  users ||--o{ school_list_history : "created_by"
  products ||--o{ school_list_template_items : "product_id"
  school_list_templates ||--o{ school_list_template_items : "template_id"
  users ||--o{ school_list_templates : "created_by"
  users ||--o{ school_list_templates : "updated_by"
  products ||--o{ school_quotation_items : "product_id"
  school_quotations ||--o{ school_quotation_items : "quotation_id"
  school_list_template_items ||--o{ school_quotation_items : "template_item_id"
  banks ||--o{ school_quotation_payments : "bank_id"
  school_quotations ||--o{ school_quotation_payments : "quotation_id"
  users ||--o{ school_quotation_payments : "received_by"
  school_quotation_payments ||--o{ school_quotation_payments : "reversal_of_id"
  users ||--o{ school_quotation_payments : "voided_by"
  users ||--o{ school_quotations : "cancelled_by"
  users ||--o{ school_quotations : "created_by"
  users ||--o{ school_quotations : "delivered_by"
  users ||--o{ school_quotations : "finished_by"
  school_list_templates ||--o{ school_quotations : "template_id"
  users ||--o{ school_quotations : "updated_by"
  users ||--o{ school_supply_allocations : "created_by"
  school_dispatches ||--o{ school_supply_allocations : "dispatch_id"
  products ||--o{ school_supply_allocations : "product_id"
  purchases ||--o{ school_supply_allocations : "purchase_id"
  school_quotations ||--o{ school_supply_allocations : "quotation_id"
  users ||--o{ school_supply_allocations : "released_by"
  inventory_movements ||--o{ school_supply_allocations : "source_movement_id"
  users ||--o{ school_supply_settings : "updated_by"
```

## `school_dispatch_items`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760008300000-SchoolListSupply.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `dispatch_school_quotation`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `dispatch_id` | uuid | NOT NULL |  |
| `product_id` | uuid | sí |  |
| `product_name` | character varying(150) | NOT NULL |  |
| `requested` | integer | NOT NULL |  |
| `supplied` | integer | NOT NULL |  |
| `delivered` | integer | NOT NULL |  |
| `inventory_controlled` | boolean | NOT NULL |  |

| Restricción | Tipo | Definición |
|---|---|---|
| `school_dispatch_items_delivered_check` | CHECK | CHECK ((delivered &gt;= 0)) |
| `school_dispatch_items_requested_check` | CHECK | CHECK ((requested &gt; 0)) |
| `school_dispatch_items_supplied_check` | CHECK | CHECK ((supplied &gt;= 0)) |
| `school_dispatch_items_dispatch_id_fkey` | FK | FOREIGN KEY (dispatch_id) REFERENCES school_dispatches(id) ON DELETE RESTRICT |
| `school_dispatch_items_product_id_fkey` | FK | FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT |
| `school_dispatch_items_pkey` | PK | PRIMARY KEY (id) |

**Índices:**

- `school_dispatch_items_pkey`: CREATE UNIQUE INDEX school_dispatch_items_pkey ON public.school_dispatch_items USING btree (id)

**Triggers:**

- `trg_school_dispatch_items_guard`: CREATE TRIGGER trg_school_dispatch_items_guard BEFORE DELETE OR UPDATE ON public.school_dispatch_items FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard()

## `school_dispatches`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760008300000-SchoolListSupply.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `dispatch_school_quotation`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `quotation_id` | uuid | NOT NULL |  |
| `dispatched_at` | timestamp with time zone | NOT NULL | now() |
| `dispatched_by` | uuid | NOT NULL |  |
| `observations` | character varying(500) | sí |  |
| `idempotency_key` | character varying(100) | NOT NULL |  |

| Restricción | Tipo | Definición |
|---|---|---|
| `school_dispatches_dispatched_by_fkey` | FK | FOREIGN KEY (dispatched_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_dispatches_quotation_id_fkey` | FK | FOREIGN KEY (quotation_id) REFERENCES school_quotations(id) ON DELETE RESTRICT |
| `school_dispatches_pkey` | PK | PRIMARY KEY (id) |
| `school_dispatches_idempotency_key_key` | UNIQUE | UNIQUE (idempotency_key) |
| `school_dispatches_quotation_id_key` | UNIQUE | UNIQUE (quotation_id) |

**Índices:**

- `school_dispatches_idempotency_key_key`: CREATE UNIQUE INDEX school_dispatches_idempotency_key_key ON public.school_dispatches USING btree (idempotency_key)
- `school_dispatches_pkey`: CREATE UNIQUE INDEX school_dispatches_pkey ON public.school_dispatches USING btree (id)
- `school_dispatches_quotation_id_key`: CREATE UNIQUE INDEX school_dispatches_quotation_id_key ON public.school_dispatches USING btree (quotation_id)

**Triggers:**

- `trg_school_dispatches_guard`: CREATE TRIGGER trg_school_dispatches_guard BEFORE DELETE OR UPDATE ON public.school_dispatches FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard()

## `school_list_history`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760007900000-SchoolLists.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `allocate_school_supply_manual`, `cancel_school_quotation`, `change_school_quotation_status`, `create_school_quotation`, `dispatch_school_quotation`, `duplicate_school_list_template`, `save_school_list_template`, `school_quotation_insert_payment`, `school_supply_allocate_fifo`, `set_school_list_template_active`, `set_school_quotation_observations`, `update_school_quotation`, `void_school_quotation_payment`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | bigint | NOT NULL | nextval('school_list_history_id_seq'::regclass) |
| `entity_type` | character varying(10) | NOT NULL |  |
| `entity_id` | uuid | NOT NULL |  |
| `action` | character varying(20) | NOT NULL |  |
| `from_status` | character varying(20) | sí |  |
| `to_status` | character varying(20) | sí |  |
| `details` | jsonb | NOT NULL | '{}'::jsonb |
| `created_by` | uuid | NOT NULL |  |
| `created_at` | timestamp with time zone | NOT NULL | now() |

| Restricción | Tipo | Definición |
|---|---|---|
| `school_list_history_entity_type_check` | CHECK | CHECK (((entity_type)::text = ANY ((ARRAY['TEMPLATE'::character varying, 'QUOTATION'::character varying])::text[]))) |
| `school_list_history_created_by_fkey` | FK | FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_list_history_pkey` | PK | PRIMARY KEY (id) |

**Índices:**

- `IDX_school_list_history_entity`: CREATE INDEX "IDX_school_list_history_entity" ON public.school_list_history USING btree (entity_type, entity_id, id)
- `school_list_history_pkey`: CREATE UNIQUE INDEX school_list_history_pkey ON public.school_list_history USING btree (id)

**Triggers:**

- `trg_school_history_guard`: CREATE TRIGGER trg_school_history_guard BEFORE DELETE OR UPDATE ON public.school_list_history FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard()

## `school_list_template_items`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760007900000-SchoolLists.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `duplicate_school_list_template`, `save_school_list_template`, `school_list_template_insert_items`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `template_id` | uuid | NOT NULL |  |
| `line_no` | integer | NOT NULL |  |
| `product_id` | uuid | sí |  |
| `product_name` | character varying(150) | NOT NULL |  |
| `description` | character varying(255) | sí |  |
| `quantity` | integer | NOT NULL |  |
| `unit_price` | numeric(12,2) | NOT NULL |  |
| `subtotal` | numeric(12,2) | sí | ((quantity)::numeric * unit_price) |
| `observations` | character varying(255) | sí |  |

| Restricción | Tipo | Definición |
|---|---|---|
| `school_list_template_items_quantity_check` | CHECK | CHECK (((quantity &gt;= 1) AND (quantity &lt;= 9999))) |
| `school_list_template_items_unit_price_check` | CHECK | CHECK ((unit_price &gt;= (0)::numeric)) |
| `school_list_template_items_product_id_fkey` | FK | FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT |
| `school_list_template_items_template_id_fkey` | FK | FOREIGN KEY (template_id) REFERENCES school_list_templates(id) ON DELETE RESTRICT |
| `school_list_template_items_pkey` | PK | PRIMARY KEY (id) |

**Índices:**

- `IDX_school_list_template_items_template`: CREATE INDEX "IDX_school_list_template_items_template" ON public.school_list_template_items USING btree (template_id, line_no)
- `school_list_template_items_pkey`: CREATE UNIQUE INDEX school_list_template_items_pkey ON public.school_list_template_items USING btree (id)

## `school_list_templates`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760007900000-SchoolLists.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `duplicate_school_list_template`, `save_school_list_template`, `set_school_list_template_active`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `name` | character varying(120) | NOT NULL |  |
| `grade` | character varying(60) | NOT NULL |  |
| `description` | character varying(500) | sí |  |
| `is_active` | boolean | NOT NULL | true |
| `sort_order` | integer | NOT NULL | 100 |
| `version` | integer | NOT NULL | 1 |
| `created_by` | uuid | sí |  |
| `updated_by` | uuid | sí |  |
| `created_at` | timestamp with time zone | NOT NULL | now() |
| `updated_at` | timestamp with time zone | NOT NULL | now() |

| Restricción | Tipo | Definición |
|---|---|---|
| `school_list_templates_created_by_fkey` | FK | FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_list_templates_updated_by_fkey` | FK | FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_list_templates_pkey` | PK | PRIMARY KEY (id) |
| `UQ_school_list_templates_name` | UNIQUE | UNIQUE (name) |

**Índices:**

- `UQ_school_list_templates_name`: CREATE UNIQUE INDEX "UQ_school_list_templates_name" ON public.school_list_templates USING btree (name)
- `school_list_templates_pkey`: CREATE UNIQUE INDEX school_list_templates_pkey ON public.school_list_templates USING btree (id)

**Triggers:**

- `trg_school_templates_no_delete`: CREATE TRIGGER trg_school_templates_no_delete BEFORE DELETE ON public.school_list_templates FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard()

## `school_quotation_items`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760007900000-SchoolLists.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `school_quotation_insert_items`, `update_school_quotation`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `quotation_id` | uuid | NOT NULL |  |
| `line_no` | integer | NOT NULL |  |
| `source` | character varying(12) | NOT NULL |  |
| `template_item_id` | uuid | sí |  |
| `product_id` | uuid | sí |  |
| `product_name` | character varying(150) | NOT NULL |  |
| `description` | character varying(255) | sí |  |
| `quantity` | integer | NOT NULL |  |
| `unit_price` | numeric(12,2) | NOT NULL |  |
| `discount` | numeric(12,2) | NOT NULL | 0 |
| `subtotal` | numeric(12,2) | sí | (((quantity)::numeric * unit_price) - discount) |
| `observations` | character varying(255) | sí |  |

| Restricción | Tipo | Definición |
|---|---|---|
| `CHK_school_quotation_items_discount` | CHECK | CHECK ((discount &lt;= ((quantity)::numeric * unit_price))) |
| `school_quotation_items_discount_check` | CHECK | CHECK ((discount &gt;= (0)::numeric)) |
| `school_quotation_items_quantity_check` | CHECK | CHECK (((quantity &gt;= 1) AND (quantity &lt;= 9999))) |
| `school_quotation_items_source_check` | CHECK | CHECK (((source)::text = ANY ((ARRAY['PLANTILLA'::character varying, 'INVENTARIO'::character varying, 'MANUAL'::character varying])::text[]))) |
| `school_quotation_items_unit_price_check` | CHECK | CHECK ((unit_price &gt;= (0)::numeric)) |
| `school_quotation_items_product_id_fkey` | FK | FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT |
| `school_quotation_items_quotation_id_fkey` | FK | FOREIGN KEY (quotation_id) REFERENCES school_quotations(id) ON DELETE RESTRICT |
| `school_quotation_items_template_item_id_fkey` | FK | FOREIGN KEY (template_item_id) REFERENCES school_list_template_items(id) ON DELETE SET NULL |
| `school_quotation_items_pkey` | PK | PRIMARY KEY (id) |

**Índices:**

- `IDX_school_quotation_items_quotation`: CREATE INDEX "IDX_school_quotation_items_quotation" ON public.school_quotation_items USING btree (quotation_id, line_no)
- `school_quotation_items_pkey`: CREATE UNIQUE INDEX school_quotation_items_pkey ON public.school_quotation_items USING btree (id)

## `school_quotation_payments`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760007900000-SchoolLists.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `cancel_school_quotation`, `school_quotation_insert_payment`, `void_school_quotation_payment`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `quotation_id` | uuid | NOT NULL |  |
| `receipt_number` | character varying(20) | NOT NULL |  |
| `kind` | character varying(12) | NOT NULL |  |
| `amount` | numeric(12,2) | NOT NULL |  |
| `payment_method` | character varying(20) | NOT NULL |  |
| `bank_id` | uuid | sí |  |
| `reference` | character varying(60) | sí |  |
| `observations` | character varying(500) | sí |  |
| `balance_after` | numeric(12,2) | NOT NULL |  |
| `status` | character varying(10) | NOT NULL | 'APLICADO'::character varying |
| `reversal_of_id` | uuid | sí |  |
| `received_by` | uuid | NOT NULL |  |
| `received_at` | timestamp with time zone | NOT NULL | now() |
| `voided_at` | timestamp with time zone | sí |  |
| `voided_by` | uuid | sí |  |
| `void_reason` | character varying(500) | sí |  |
| `idempotency_key` | character varying(100) | NOT NULL |  |

| Restricción | Tipo | Definición |
|---|---|---|
| `CHK_school_payments_reversal` | CHECK | CHECK ((((kind)::text = 'ANULACION'::text) = (reversal_of_id IS NOT NULL))) |
| `school_quotation_payments_amount_check` | CHECK | CHECK ((amount &gt; (0)::numeric)) |
| `school_quotation_payments_kind_check` | CHECK | CHECK (((kind)::text = ANY ((ARRAY['ANTICIPO'::character varying, 'ABONO'::character varying, 'DEVOLUCION'::character varying, 'ANULACION'::character varying])::text[]))) |
| `school_quotation_payments_payment_method_check` | CHECK | CHECK (((payment_method)::text = ANY ((ARRAY['EFECTIVO'::character varying, 'TRANSFERENCIA'::character varying, 'DEPOSITO'::character varying, 'TARJETA'::character varying, 'OTRO'::character varying])::text[]))) |
| `school_quotation_payments_status_check` | CHECK | CHECK (((status)::text = ANY ((ARRAY['APLICADO'::character varying, 'ANULADO'::character varying])::text[]))) |
| `school_quotation_payments_bank_id_fkey` | FK | FOREIGN KEY (bank_id) REFERENCES banks(id) ON DELETE RESTRICT |
| `school_quotation_payments_quotation_id_fkey` | FK | FOREIGN KEY (quotation_id) REFERENCES school_quotations(id) ON DELETE RESTRICT |
| `school_quotation_payments_received_by_fkey` | FK | FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_quotation_payments_reversal_of_id_fkey` | FK | FOREIGN KEY (reversal_of_id) REFERENCES school_quotation_payments(id) ON DELETE RESTRICT |
| `school_quotation_payments_voided_by_fkey` | FK | FOREIGN KEY (voided_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_quotation_payments_pkey` | PK | PRIMARY KEY (id) |
| `school_quotation_payments_idempotency_key_key` | UNIQUE | UNIQUE (idempotency_key) |
| `school_quotation_payments_receipt_number_key` | UNIQUE | UNIQUE (receipt_number) |

**Índices:**

- `IDX_school_quotation_payments_quotation`: CREATE INDEX "IDX_school_quotation_payments_quotation" ON public.school_quotation_payments USING btree (quotation_id, received_at)
- `UQ_school_quotation_payments_reversal`: CREATE UNIQUE INDEX "UQ_school_quotation_payments_reversal" ON public.school_quotation_payments USING btree (reversal_of_id) WHERE (reversal_of_id IS NOT NULL)
- `school_quotation_payments_idempotency_key_key`: CREATE UNIQUE INDEX school_quotation_payments_idempotency_key_key ON public.school_quotation_payments USING btree (idempotency_key)
- `school_quotation_payments_pkey`: CREATE UNIQUE INDEX school_quotation_payments_pkey ON public.school_quotation_payments USING btree (id)
- `school_quotation_payments_receipt_number_key`: CREATE UNIQUE INDEX school_quotation_payments_receipt_number_key ON public.school_quotation_payments USING btree (receipt_number)

**Triggers:**

- `trg_school_payments_guard`: CREATE TRIGGER trg_school_payments_guard BEFORE DELETE OR UPDATE ON public.school_quotation_payments FOR EACH ROW EXECUTE FUNCTION school_payment_guard()

## `school_quotations`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760007900000-SchoolLists.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `cancel_school_quotation`, `change_school_quotation_status`, `create_school_quotation`, `dispatch_school_quotation`, `school_quotation_refresh_status`, `school_quotation_sync_inventory`, `set_school_quotation_observations`, `update_school_quotation`, `void_school_quotation_payment`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `quotation_number` | character varying(20) | NOT NULL |  |
| `template_id` | uuid | sí |  |
| `template_name` | character varying(120) | sí |  |
| `grade` | character varying(60) | NOT NULL |  |
| `customer_name` | character varying(150) | NOT NULL |  |
| `customer_phone` | character varying(20) | NOT NULL |  |
| `student_name` | character varying(150) | sí |  |
| `quotation_date` | date | NOT NULL |  |
| `delivery_date` | date | sí |  |
| `observations` | character varying(1000) | sí |  |
| `subtotal` | numeric(12,2) | NOT NULL |  |
| `discount` | numeric(12,2) | NOT NULL | 0 |
| `total` | numeric(12,2) | NOT NULL |  |
| `status` | character varying(20) | NOT NULL |  |
| `version` | integer | NOT NULL | 1 |
| `idempotency_key` | character varying(100) | NOT NULL |  |
| `created_by` | uuid | NOT NULL |  |
| `updated_by` | uuid | sí |  |
| `created_at` | timestamp with time zone | NOT NULL | now() |
| `updated_at` | timestamp with time zone | NOT NULL | now() |
| `delivered_at` | timestamp with time zone | sí |  |
| `delivered_by` | uuid | sí |  |
| `cancelled_at` | timestamp with time zone | sí |  |
| `cancelled_by` | uuid | sí |  |
| `cancel_reason` | character varying(500) | sí |  |
| `cancel_idempotency_key` | character varying(100) | sí |  |
| `finished_at` | timestamp with time zone | sí |  |
| `finished_by` | uuid | sí |  |
| `confirmed_at` | timestamp with time zone | sí |  |

| Restricción | Tipo | Definición |
|---|---|---|
| `CHK_school_quotations_delivery` | CHECK | CHECK (((delivery_date IS NULL) OR (delivery_date &gt;= quotation_date))) |
| `CHK_school_quotations_total` | CHECK | CHECK ((total = (subtotal - discount))) |
| `school_quotations_discount_check` | CHECK | CHECK ((discount &gt;= (0)::numeric)) |
| `school_quotations_status_check` | CHECK | CHECK (((status)::text = ANY ((ARRAY['BORRADOR'::character varying, 'COTIZADA'::character varying, 'ANTICIPO_RECIBIDO'::character varying, 'PAGO_PARCIAL'::character varying, 'PAGADA'::character varying, 'EN_PREPARACION'::character varying, 'ENTREGADA'::character varying, 'CANCELADA'::character varying, 'TERMINADA'::character varying])::text[]))) |
| `school_quotations_subtotal_check` | CHECK | CHECK ((subtotal &gt;= (0)::numeric)) |
| `school_quotations_total_check` | CHECK | CHECK ((total &gt; (0)::numeric)) |
| `school_quotations_cancelled_by_fkey` | FK | FOREIGN KEY (cancelled_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_quotations_created_by_fkey` | FK | FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_quotations_delivered_by_fkey` | FK | FOREIGN KEY (delivered_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_quotations_finished_by_fkey` | FK | FOREIGN KEY (finished_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_quotations_template_id_fkey` | FK | FOREIGN KEY (template_id) REFERENCES school_list_templates(id) ON DELETE RESTRICT |
| `school_quotations_updated_by_fkey` | FK | FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_quotations_pkey` | PK | PRIMARY KEY (id) |
| `school_quotations_cancel_idempotency_key_key` | UNIQUE | UNIQUE (cancel_idempotency_key) |
| `school_quotations_idempotency_key_key` | UNIQUE | UNIQUE (idempotency_key) |
| `school_quotations_quotation_number_key` | UNIQUE | UNIQUE (quotation_number) |

**Índices:**

- `IDX_school_quotations_date`: CREATE INDEX "IDX_school_quotations_date" ON public.school_quotations USING btree (quotation_date DESC, created_at DESC)
- `IDX_school_quotations_grade`: CREATE INDEX "IDX_school_quotations_grade" ON public.school_quotations USING btree (grade)
- `IDX_school_quotations_status`: CREATE INDEX "IDX_school_quotations_status" ON public.school_quotations USING btree (status)
- `school_quotations_cancel_idempotency_key_key`: CREATE UNIQUE INDEX school_quotations_cancel_idempotency_key_key ON public.school_quotations USING btree (cancel_idempotency_key)
- `school_quotations_idempotency_key_key`: CREATE UNIQUE INDEX school_quotations_idempotency_key_key ON public.school_quotations USING btree (idempotency_key)
- `school_quotations_pkey`: CREATE UNIQUE INDEX school_quotations_pkey ON public.school_quotations USING btree (id)
- `school_quotations_quotation_number_key`: CREATE UNIQUE INDEX school_quotations_quotation_number_key ON public.school_quotations USING btree (quotation_number)

**Triggers:**

- `trg_school_quotations_no_delete`: CREATE TRIGGER trg_school_quotations_no_delete BEFORE DELETE ON public.school_quotations FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard()

## `school_supply_allocations`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760008300000-SchoolListSupply.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)
- **Funciones SQL que la escriben:** `allocate_school_supply_manual`, `dispatch_school_quotation`, `school_quotation_sync_inventory`, `school_supply_allocate_fifo`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `quotation_id` | uuid | NOT NULL |  |
| `product_id` | uuid | NOT NULL |  |
| `quantity` | integer | NOT NULL |  |
| `source_type` | character varying(12) | NOT NULL |  |
| `source_movement_id` | uuid | sí |  |
| `purchase_id` | uuid | sí |  |
| `mode` | character varying(12) | NOT NULL |  |
| `status` | character varying(10) | NOT NULL | 'ASIGNADA'::character varying |
| `idempotency_key` | character varying(100) | sí |  |
| `created_by` | uuid | NOT NULL |  |
| `created_at` | timestamp with time zone | NOT NULL | now() |
| `released_at` | timestamp with time zone | sí |  |
| `released_by` | uuid | sí |  |
| `release_reason` | character varying(500) | sí |  |
| `dispatch_id` | uuid | sí |  |
| `delivered_at` | timestamp with time zone | sí |  |

| Restricción | Tipo | Definición |
|---|---|---|
| `school_supply_allocations_mode_check` | CHECK | CHECK (((mode)::text = ANY ((ARRAY['AUTO'::character varying, 'FIFO_MANUAL'::character varying, 'MANUAL'::character varying])::text[]))) |
| `school_supply_allocations_quantity_check` | CHECK | CHECK ((quantity &gt; 0)) |
| `school_supply_allocations_source_type_check` | CHECK | CHECK (((source_type)::text = ANY ((ARRAY['EXISTENCIA'::character varying, 'COMPRA'::character varying, 'TRASLADO'::character varying, 'DEVOLUCION'::character varying])::text[]))) |
| `school_supply_allocations_status_check` | CHECK | CHECK (((status)::text = ANY ((ARRAY['ASIGNADA'::character varying, 'LIBERADA'::character varying, 'ENTREGADA'::character varying])::text[]))) |
| `school_supply_allocations_created_by_fkey` | FK | FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_supply_allocations_dispatch_id_fkey` | FK | FOREIGN KEY (dispatch_id) REFERENCES school_dispatches(id) ON DELETE RESTRICT |
| `school_supply_allocations_product_id_fkey` | FK | FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT |
| `school_supply_allocations_purchase_id_fkey` | FK | FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE RESTRICT |
| `school_supply_allocations_quotation_id_fkey` | FK | FOREIGN KEY (quotation_id) REFERENCES school_quotations(id) ON DELETE RESTRICT |
| `school_supply_allocations_released_by_fkey` | FK | FOREIGN KEY (released_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_supply_allocations_source_movement_id_fkey` | FK | FOREIGN KEY (source_movement_id) REFERENCES inventory_movements(id) ON DELETE RESTRICT |
| `school_supply_allocations_pkey` | PK | PRIMARY KEY (id) |
| `school_supply_allocations_idempotency_key_key` | UNIQUE | UNIQUE (idempotency_key) |

**Índices:**

- `IDX_school_supply_allocations_line`: CREATE INDEX "IDX_school_supply_allocations_line" ON public.school_supply_allocations USING btree (quotation_id, product_id, status)
- `IDX_school_supply_allocations_movement`: CREATE INDEX "IDX_school_supply_allocations_movement" ON public.school_supply_allocations USING btree (source_movement_id) WHERE (source_movement_id IS NOT NULL)
- `IDX_school_supply_allocations_product`: CREATE INDEX "IDX_school_supply_allocations_product" ON public.school_supply_allocations USING btree (product_id, status)
- `IDX_school_supply_allocations_purchase`: CREATE INDEX "IDX_school_supply_allocations_purchase" ON public.school_supply_allocations USING btree (purchase_id) WHERE (purchase_id IS NOT NULL)
- `school_supply_allocations_idempotency_key_key`: CREATE UNIQUE INDEX school_supply_allocations_idempotency_key_key ON public.school_supply_allocations USING btree (idempotency_key)
- `school_supply_allocations_pkey`: CREATE UNIQUE INDEX school_supply_allocations_pkey ON public.school_supply_allocations USING btree (id)

**Triggers:**

- `trg_school_supply_allocations_guard`: CREATE TRIGGER trg_school_supply_allocations_guard BEFORE DELETE OR UPDATE ON public.school_supply_allocations FOR EACH ROW EXECUTE FUNCTION school_supply_allocation_guard()

## `school_supply_settings`

- **Entidad TypeORM:** ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)
- **Creada en:** `1760008300000-SchoolListSupply.ts`
- **Archivos TypeScript que la usan:** [typeorm-school-list.repository.ts](../reference/backend/school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts), [school-supply.e2e-spec.ts](../reference/backend/e2e.md#f-comercial-jhoel-api-test-school-supply-e2e-spec-ts)
- **Funciones SQL que la escriben:** `set_school_supply_mode`

| Columna | Tipo | Nulo | Default |
|---|---|---|---|
| `id` | smallint | NOT NULL |  |
| `allocation_mode` | character varying(12) | NOT NULL | 'FIFO_AUTO'::character varying |
| `updated_by` | uuid | sí |  |
| `updated_at` | timestamp with time zone | NOT NULL | now() |

| Restricción | Tipo | Definición |
|---|---|---|
| `school_supply_settings_allocation_mode_check` | CHECK | CHECK (((allocation_mode)::text = ANY ((ARRAY['FIFO_AUTO'::character varying, 'MANUAL'::character varying])::text[]))) |
| `school_supply_settings_id_check` | CHECK | CHECK ((id = 1)) |
| `school_supply_settings_updated_by_fkey` | FK | FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT |
| `school_supply_settings_pkey` | PK | PRIMARY KEY (id) |

**Índices:**

- `school_supply_settings_pkey`: CREATE UNIQUE INDEX school_supply_settings_pkey ON public.school_supply_settings USING btree (id)

