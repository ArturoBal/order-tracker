import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1781476650284 implements MigrationInterface {
  name = 'InitSchema1781476650284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "order_status_enum" AS ENUM ('Pending', 'Paid', 'Shipped');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order" (
        "customerName" character varying NOT NULL,
        "item" character varying NOT NULL,
        "quantity" integer NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "status" "order_status_enum" NOT NULL DEFAULT 'Pending',
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "order_status_enum"`);
  }
}
