import { MigrationInterface, QueryRunner } from "typeorm";

export class TripDeletedAt1652012108500 implements MigrationInterface {
    name = 'TripDeletedAt1652012108500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "trips"
            ADD "deleted_at" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "trips" DROP COLUMN "deleted_at"
        `);
    }

}
