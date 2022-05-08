import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartialVinIndex1652001544237 implements MigrationInterface {
  name = 'PartialVinIndex1652001544237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."unique_car_vin_number"
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_066a270f2fd181fd7e1097ebd5" ON "cars" ("vin")
            WHERE cars.deleted_at IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_066a270f2fd181fd7e1097ebd5"
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "unique_car_vin_number" ON "cars" ("vin")
            WHERE (deleted_at IS NULL)
        `);
  }
}
