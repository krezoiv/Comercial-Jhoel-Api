import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * "Atajos de Teclado" — a new Sistema catalog, structurally a clone of
 * `transaction_types`/`account_types` (flat CRUD, partial-unique-active
 * name-equivalent, admin-only mutation, read open to any authenticated
 * account — the shortcuts must be readable by every role so
 * `KeyboardShortcutsService` can actually use them, not just admins who can
 * manage them). Purely additive: a brand-new table, no existing table
 * touched, no destructive change of any kind.
 *
 * Replaces the previous purely-frontend, hardcoded `KEYBOARD_SHORTCUTS`
 * constant (`core/data/keyboard-shortcuts.data.ts`) as the source of truth
 * — the one shortcut that constant declared (Alt+F12 → Inventario) is
 * seeded here as a real row so existing behavior is preserved byte-for-byte
 * after the frontend switches to reading from `GET /keyboard-shortcuts`.
 */
export class CreateKeyboardShortcuts1760001300000 implements MigrationInterface {
  name = 'CreateKeyboardShortcuts1760001300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'keyboard_shortcuts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'label', type: 'varchar', length: '150' },
          // `KeyboardEvent.key` value (e.g. 'F11') — compared case-
          // insensitively everywhere (frontend match + the unique index
          // below), never assumed to already be normalized.
          { name: 'key', type: 'varchar', length: '20' },
          { name: 'alt_key', type: 'boolean', default: false },
          { name: 'ctrl_key', type: 'boolean', default: false },
          { name: 'shift_key', type: 'boolean', default: false },
          { name: 'meta_key', type: 'boolean', default: false },
          { name: 'route', type: 'varchar', length: '200' },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_keyboard_shortcuts_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_keyboard_shortcuts_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // A shortcut with zero modifiers would shadow ordinary single-key
    // typing everywhere outside a text field — the frontend already
    // ignores a modifier-less combo while a field is focused, but nothing
    // protects the rest of the app from an admin accidentally registering
    // e.g. a bare "S". Shift alone doesn't count (Shift+letter is normal
    // typing for a capital letter) — at least Alt, Ctrl, or Meta/Cmd is
    // required.
    await queryRunner.query(`
      ALTER TABLE "keyboard_shortcuts"
      ADD CONSTRAINT "CHK_keyboard_shortcuts_requires_modifier"
      CHECK ("alt_key" OR "ctrl_key" OR "meta_key")
    `);

    // Light structural guard only — the real "is this a route that
    // actually exists" curation happens in the frontend's own form (a
    // dropdown built from `DASHBOARD_NAV_ITEMS`, the same list the sidebar
    // itself renders from), never a hardcoded route enum here that would
    // need a migration every time a new dashboard page ships.
    await queryRunner.query(`
      ALTER TABLE "keyboard_shortcuts"
      ADD CONSTRAINT "CHK_keyboard_shortcuts_route_is_dashboard"
      CHECK ("route" LIKE '/dashboard/%')
    `);

    // Case-insensitive combo uniqueness among active rows only — two active
    // shortcuts bound to the identical key+modifiers would be genuinely
    // ambiguous (whichever the list happens to return first would win
    // silently). Same `LOWER(...)` partial-unique-index technique already
    // established by `presentation_types`/`units_of_measure`.
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_keyboard_shortcuts_combo_active"
      ON "keyboard_shortcuts" (LOWER("key"), "alt_key", "ctrl_key", "shift_key", "meta_key")
      WHERE "is_active" = true
    `);

    // Preserves the one shortcut that already existed as a hardcoded
    // frontend constant — `created_by` resolves to the earliest-created
    // user (the seeded/original admin), same reasoning
    // `CreatePresentationTypesTable`'s own seed rows already used.
    await queryRunner.query(`
      INSERT INTO "keyboard_shortcuts" ("label", "key", "alt_key", "route", "created_by")
      SELECT 'Ir a Inventario', 'F12', true, '/dashboard/inventario',
             (SELECT id FROM "users" ORDER BY "created_at" ASC LIMIT 1)
    `);
  }

  public async down(): Promise<void> {
    // No downgrade provided — this migration only adds a brand-new table
    // with no existing reader to break; a rollback has nothing real to
    // undo beyond dropping it, and this codebase's own convention (see
    // `CreateInventoryLocationsAndPresentations`, `AddRechargeDayGateTo...`)
    // is to skip a `down()` once real rows may already depend on the
    // table existing.
  }
}
