import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Default credentials: admin@ordertracker.com / Admin1234!
// Change the password after the first login.
export class SeedAdminUser1781476800000 implements MigrationInterface {
  name = 'SeedAdminUser1781476800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await bcrypt.hash('Admin1234!', 10);
    await queryRunner.query(
      `INSERT INTO "user" (id, name, email, password, role)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4)`,
      ['Admin', 'admin@ordertracker.com', password, 'admin'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user" WHERE email = $1`, [
      'admin@ordertracker.com',
    ]);
  }
}
