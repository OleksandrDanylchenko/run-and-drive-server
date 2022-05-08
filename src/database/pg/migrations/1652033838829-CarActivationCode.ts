import { MigrationInterface, QueryRunner } from 'typeorm';

export class CarActivationCode1652033838829 implements MigrationInterface {
  name = 'CarActivationCode1652033838829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD "activation_code" character varying(8) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "cars"
            ADD CONSTRAINT "UQ_3095aa66c19544e9dc750f52c89" UNIQUE ("activation_code")
        `);
    await queryRunner.query(`
            ALTER TABLE "engineers" DROP CONSTRAINT "UQ_4ef584dde5f315b031ec5ab163d"
        `);
    await queryRunner.query(`
            ALTER TABLE "engineers" DROP COLUMN "activation_login"
        `);
    await queryRunner.query(`
            ALTER TABLE "engineers"
            ADD "activation_login" character varying(8) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "engineers"
            ADD CONSTRAINT "UQ_4ef584dde5f315b031ec5ab163d" UNIQUE ("activation_login")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "engineers" DROP CONSTRAINT "UQ_4ef584dde5f315b031ec5ab163d"
        `);
    await queryRunner.query(`
            ALTER TABLE "engineers" DROP COLUMN "activation_login"
        `);
    await queryRunner.query(`
            ALTER TABLE "engineers"
            ADD "activation_login" character varying(200) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "engineers"
            ADD CONSTRAINT "UQ_4ef584dde5f315b031ec5ab163d" UNIQUE ("activation_login")
        `);
    await queryRunner.query(`
            ALTER TABLE "cars" DROP CONSTRAINT "UQ_3095aa66c19544e9dc750f52c89"
        `);
    await queryRunner.query(`
            ALTER TABLE "cars" DROP COLUMN "activation_code"
        `);
  }
}
