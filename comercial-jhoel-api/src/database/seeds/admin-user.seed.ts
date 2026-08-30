import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { UserOrmEntity } from '../../modules/users/infrastructure/persistence/user.orm-entity';
import { RoleOrmEntity } from '../../modules/roles/infrastructure/persistence/role.orm-entity';

const SALT_ROUNDS = 10;

async function run(): Promise<void> {
  await AppDataSource.initialize();
  const repository = AppDataSource.getRepository(UserOrmEntity);
  const roleRepository = AppDataSource.getRepository(RoleOrmEntity);

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@comercialjhoel.com';
  const username = process.env.SEED_ADMIN_USERNAME ?? 'admin';
  const phone = process.env.SEED_ADMIN_PHONE ?? '00000000';
  const existing = await repository.findOne({ where: { email } });
  if (existing) {
    if (!existing.username || !existing.phone) {
      await repository.update(existing.id, { username, phone });
      console.log(`Usuario admin actualizado con username/phone: ${email}`);
    } else {
      console.log(`El usuario admin ya existe: ${email}`);
    }
    await AppDataSource.destroy();
    return;
  }

  const adminRole = await roleRepository.findOne({ where: { name: 'ADMIN' } });
  if (!adminRole) {
    throw new Error(
      'El rol ADMIN no existe — ejecuta las migraciones antes del seed.',
    );
  }

  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD ?? 'admin123',
    SALT_ROUNDS,
  );
  await repository.save(
    repository.create({
      name: 'Administrador',
      email,
      username,
      phone,
      passwordHash,
      roleId: adminRole.id,
    }),
  );

  console.log(`Usuario admin creado: ${email}`);
  await AppDataSource.destroy();
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
