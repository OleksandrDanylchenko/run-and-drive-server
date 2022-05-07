import { MigrationInterface, QueryRunner } from 'typeorm';

export class CarsTable1651923554985 implements MigrationInterface {
  name = 'CarsTable1651923554985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars"
                RENAME COLUMN "photos_urls" TO "album_hash"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars" DROP COLUMN "album_hash"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD "album_hash" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD CONSTRAINT "UQ_a091dbf286a26a2f16853b84965" UNIQUE ("album_hash")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars" DROP CONSTRAINT "UQ_a091dbf286a26a2f16853b84965"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars" DROP COLUMN "album_hash"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD "album_hash" character varying array NOT NULL DEFAULT '{}'
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
                RENAME COLUMN "album_hash" TO "photos_urls"
        `);
  }
}
