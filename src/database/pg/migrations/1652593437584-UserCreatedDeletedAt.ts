import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserCreatedDeletedAt1652593437584 implements MigrationInterface {
  name = 'UserCreatedDeletedAt1652593437584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "deleted_at" TIMESTAMP
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "deleted_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
  }
}
