import { MigrationInterface, QueryRunner } from "typeorm";

export class EngineersTable1651519042691 implements MigrationInterface {
    name = 'EngineersTable1651519042691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "engineers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "activation_login" character varying(200) NOT NULL,
                "employee_number" SERIAL NOT NULL,
                "user_id" uuid,
                CONSTRAINT "UQ_4ef584dde5f315b031ec5ab163d" UNIQUE ("activation_login"),
                CONSTRAINT "REL_8a7ada0719c1824c3f0cb74c63" UNIQUE ("user_id"),
                CONSTRAINT "PK_e058ee32d1395a16bd3b6fc0f66" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "engineers"
            ADD CONSTRAINT "FK_8a7ada0719c1824c3f0cb74c63d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "engineers" DROP CONSTRAINT "FK_8a7ada0719c1824c3f0cb74c63d"
        `);
        await queryRunner.query(`
            DROP TABLE "engineers"
        `);
    }

}
