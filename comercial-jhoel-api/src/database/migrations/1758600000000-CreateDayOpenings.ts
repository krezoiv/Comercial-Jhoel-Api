import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * "Apertura del Día" — Agentes Bancarios > Bancos. Antes de esta
 * migración no existía ninguna estructura que representara "el usuario
 * confirmó que quiere empezar a trabajar en esta fecha" independientemente
 * de si ya se guardó algún saldo: `bank_balances.final_balance` es
 * `NOT NULL`, así que no puede representar "abierto pero sin saldos
 * todavía" sin violar su propio esquema — de ahí que se necesite esta
 * tabla nueva, mínima, en vez de reutilizar `bank_balances` con un valor
 * centinela.
 *
 * Una fila por fecha (`UNIQUE (date)`): "aperturar" un día ya aperturado
 * es una operación idempotente (ver `TypeOrmDayOpeningRepository.open`),
 * nunca crea una segunda fila ni falla.
 *
 * Puramente aditiva — tabla nueva, ninguna existente se toca.
 */
export class CreateDayOpenings1758600000000 implements MigrationInterface {
  name = 'CreateDayOpenings1758600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'day_openings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'date', type: 'date', isUnique: true },
          { name: 'opened_by', type: 'uuid' },
          { name: 'opened_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_day_openings_opened_by',
            columnNames: ['opened_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('day_openings');
  }
}
