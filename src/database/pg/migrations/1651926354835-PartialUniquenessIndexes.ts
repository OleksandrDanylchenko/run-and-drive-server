import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartialUniquenessIndexes1651926354835
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars" DROP CONSTRAINT "UQ_1a56deecb54b4ed4917445f49e9"
        `);
    await queryRunner.query(`
        CREATE UNIQUE INDEX unique_car_vin_number
            ON cars(vin)
            WHERE cars.deleted_at IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD CONSTRAINT "UQ_3591792b5f86e413026371f130b" UNIQUE ("vin")
        `);
    await queryRunner.query(`
        DROP INDEX IF EXISTS unique_car_vin_number
    `);
  }
}
