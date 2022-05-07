import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPhotoObject1651936299360 implements MigrationInterface {
  name = 'UserPhotoObject1651936299360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "photo_url" TO "photo"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "photo"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "photo" json
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "photo"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "photo" character varying(300)
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "photo" TO "photo_url"
        `);
  }
}
