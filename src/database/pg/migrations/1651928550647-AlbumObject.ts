import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlbumObject1651928550647 implements MigrationInterface {
  name = 'AlbumObject1651928550647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars"
                RENAME COLUMN "album_hash" TO "album"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
                RENAME CONSTRAINT "UQ_a091dbf286a26a2f16853b84965" TO "UQ_45e0744b6426f3aff9e5a49f4eb"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars" DROP CONSTRAINT "UQ_45e0744b6426f3aff9e5a49f4eb"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars" DROP COLUMN "album"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD "album" json
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars" DROP COLUMN "album"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD "album" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD CONSTRAINT "UQ_45e0744b6426f3aff9e5a49f4eb" UNIQUE ("album")
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
                RENAME CONSTRAINT "UQ_45e0744b6426f3aff9e5a49f4eb" TO "UQ_a091dbf286a26a2f16853b84965"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
                RENAME COLUMN "album" TO "album_hash"
        `);
  }
}
