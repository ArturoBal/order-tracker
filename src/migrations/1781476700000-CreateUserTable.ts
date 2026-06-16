import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1781476700000 implements MigrationInterface {
  name = 'CreateUserTable1781476700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id"       uuid                     NOT NULL DEFAULT uuid_generate_v4(),
        "name"     character varying        NOT NULL,
        "email"    character varying        NOT NULL,
        "role"     character varying        NOT NULL DEFAULT 'user',
        "password" character varying        NOT NULL,
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user_id"    PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
