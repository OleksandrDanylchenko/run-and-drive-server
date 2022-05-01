import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersTable1651428250909 implements MigrationInterface {
  name = 'UsersTable1651428250909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "surname" character varying(100) NOT NULL,
                "email" character varying(200) NOT NULL,
                "password" character varying(200) NOT NULL,
                "photo_url" character varying(300),
                "phone" character varying(20) NOT NULL,
                "refresh_token_hash" character varying(300) NOT NULL,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
