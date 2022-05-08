import { MigrationInterface, QueryRunner } from 'typeorm';

export class TripTable1652005382217 implements MigrationInterface {
  name = 'TripTable1652005382217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "trips" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "start_location" geography(Point, 4326) NOT NULL,
                "start_time" TIMESTAMP NOT NULL DEFAULT now(),
                "end_location" geography(Point, 4326),
                "end_time" TIMESTAMP,
                "total_distance" integer NOT NULL DEFAULT '0',
                "car_id" uuid,
                "user_id" uuid,
                CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_2db7a0e6a905c2fed6a0a56b4c" ON "trips" USING GiST ("start_location")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_7867516068737fe0ca70da4f9c" ON "trips" USING GiST ("end_location")
        `);
    await queryRunner.query(`
            ALTER TABLE "trips"
            ADD CONSTRAINT "FK_dfea9f5c01666a915e9eb1aca5b" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trips"
            ADD CONSTRAINT "FK_c32589af53db811884889e03663" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "trips" DROP CONSTRAINT "FK_c32589af53db811884889e03663"
        `);
    await queryRunner.query(`
            ALTER TABLE "trips" DROP CONSTRAINT "FK_dfea9f5c01666a915e9eb1aca5b"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_7867516068737fe0ca70da4f9c"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_2db7a0e6a905c2fed6a0a56b4c"
        `);
    await queryRunner.query(`
            DROP TABLE "trips"
        `);
  }
}
