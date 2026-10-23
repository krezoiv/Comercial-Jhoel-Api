import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Banco Agente (`transaction_banks`):
 *
 * 1. Logo opcional para identificar el banco en el modal "Selecciona el
 *    banco" de Transaccionar — mismas columnas que `catalog_banks`
 *    (`image_data` BYTEA + mime + tamaño). Solo visual: ninguna función
 *    financiera las lee.
 * 2. Alta del banco agente "Banco Azteca" si todavía no hay uno activo cuyo
 *    nombre contenga "azteca" (idempotente). `created_by` = el SUPER_ADMIN
 *    activo más antiguo; si no existe ninguno, no se inserta nada (se puede
 *    crear a mano en Sistema → Banco Agente). La CUENTA "Banco Azteca" en
 *    Sistema → Bancos no se crea aquí: requiere su número de cuenta real.
 *
 * `down` solo quita las columnas: el banco agente puede ya tener
 * operaciones registradas, así que nunca se borra.
 */
export class TransactionBankImageAndAzteca1760006100000 implements MigrationInterface {
  name = 'TransactionBankImageAndAzteca1760006100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE transaction_banks
        ADD COLUMN IF NOT EXISTS image_data BYTEA NULL,
        ADD COLUMN IF NOT EXISTS image_mime_type VARCHAR(50) NULL,
        ADD COLUMN IF NOT EXISTS image_size_bytes INTEGER NULL
    `);

    await queryRunner.query(`
      INSERT INTO transaction_banks (name, created_by)
      SELECT 'Banco Azteca', admin.id
      FROM (
        SELECT u.id
        FROM users u
        JOIN roles r ON r.id = u.role_id
        WHERE r.name = 'SUPER_ADMIN' AND u.is_active = true
        ORDER BY u.created_at
        LIMIT 1
      ) admin
      WHERE NOT EXISTS (
        SELECT 1 FROM transaction_banks
        WHERE is_active = true AND lower(name) LIKE '%azteca%'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE transaction_banks
        DROP COLUMN IF EXISTS image_size_bytes,
        DROP COLUMN IF EXISTS image_mime_type,
        DROP COLUMN IF EXISTS image_data
    `);
  }
}
