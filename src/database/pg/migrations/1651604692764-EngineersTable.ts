import { MigrationInterface, QueryRunner } from 'typeorm';

export class EngineersTable1651604692764 implements MigrationInterface {
  name = 'EngineersTable1651604692764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "emitters" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "activated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deactivated_at" TIMESTAMP,
                "engineer_id" uuid,
                CONSTRAINT "PK_96fd5b9757be96a1a867b042899" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "emitters"
            ADD CONSTRAINT "FK_9e2b9bf5a3aa4fdcff7a8cab8ad" FOREIGN KEY ("engineer_id") REFERENCES "engineers"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "emitters" DROP CONSTRAINT "FK_9e2b9bf5a3aa4fdcff7a8cab8ad"
        `);
    await queryRunner.query(`
            DROP TABLE "emitters"
        `);
  }
}
