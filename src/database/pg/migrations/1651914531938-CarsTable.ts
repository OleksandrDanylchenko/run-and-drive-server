import { MigrationInterface, QueryRunner } from 'typeorm';

export class CarsTable1651914531938 implements MigrationInterface {
  name = 'CarsTable1651914531938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "cars" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "vin" character varying(17) NOT NULL,
                "brand" character varying(50) NOT NULL,
                "model" character varying(50) NOT NULL,
                "year" integer NOT NULL,
                "color" character varying(50) NOT NULL,
                "photos_urls" character varying array NOT NULL DEFAULT '{}',
                "mileage" integer NOT NULL,
                "engine_capacity" numeric(2, 1) NOT NULL,
                "fuel_capacity" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_1a56deecb54b4ed4917445f49e9" UNIQUE ("vin"),
                CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "emitters"
            ADD "car_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "emitters"
            ADD CONSTRAINT "UQ_3591792b5f86e413026371f130b" UNIQUE ("car_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "emitters"
            ADD CONSTRAINT "FK_3591792b5f86e413026371f130b" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "emitters" DROP CONSTRAINT "FK_3591792b5f86e413026371f130b"
        `);
    await queryRunner.query(`
            ALTER TABLE "emitters" DROP CONSTRAINT "UQ_3591792b5f86e413026371f130b"
        `);
    await queryRunner.query(`
            ALTER TABLE "emitters" DROP COLUMN "car_id"
        `);
    await queryRunner.query(`
            DROP TABLE "cars"
        `);
  }
}
