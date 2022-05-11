import { MigrationInterface, QueryRunner } from 'typeorm';

export class PatrialUniquenessEmitters1652260686798
  implements MigrationInterface
{
  name = 'PatrialUniquenessEmitters1652260686798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "emitters" DROP CONSTRAINT "UQ_3591792b5f86e413026371f130b"
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_2fa36dc778070f2ada0a1a32fd" ON "emitters" ("car_id")
            WHERE emitters.deactivated_at IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_2fa36dc778070f2ada0a1a32fd"
        `);
    await queryRunner.query(`
            ALTER TABLE "emitters"
            ADD CONSTRAINT "UQ_3591792b5f86e413026371f130b" UNIQUE ("car_id")
        `);
  }
}
