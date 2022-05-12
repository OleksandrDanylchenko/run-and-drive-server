import { MigrationInterface, QueryRunner } from 'typeorm';

export class CarAverageConsumption1652367297726 implements MigrationInterface {
  name = 'CarAverageConsumption1652367297726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD "average_consumption" numeric(2, 1) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars" DROP COLUMN "average_consumption"
        `);
  }
}
