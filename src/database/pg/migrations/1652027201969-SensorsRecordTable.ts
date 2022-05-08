import { MigrationInterface, QueryRunner } from "typeorm";

export class SensorsRecordTable1652027201969 implements MigrationInterface {
    name = 'SensorsRecordTable1652027201969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "sensors_records" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "location" geography(Point, 4326) NOT NULL,
                "fuel_tank_occupancy" integer NOT NULL,
                "wheels_pressure" json,
                "timestamp" TIMESTAMP NOT NULL,
                "car_id" uuid,
                "trip_id" uuid,
                CONSTRAINT "PK_f5e815457445e7ea315772cb412" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2484edbafefac5cc1c0ded9510" ON "sensors_records" USING GiST ("location")
        `);
        await queryRunner.query(`
            ALTER TABLE "sensors_records"
            ADD CONSTRAINT "FK_6526095784e5665c35d503abce7" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "sensors_records"
            ADD CONSTRAINT "FK_c829a5efa599bafcc0fc4861a5b" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sensors_records" DROP CONSTRAINT "FK_c829a5efa599bafcc0fc4861a5b"
        `);
        await queryRunner.query(`
            ALTER TABLE "sensors_records" DROP CONSTRAINT "FK_6526095784e5665c35d503abce7"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_2484edbafefac5cc1c0ded9510"
        `);
        await queryRunner.query(`
            DROP TABLE "sensors_records"
        `);
    }

}
