import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorTableMovie1714276995104 implements MigrationInterface {
    name = 'RefactorTableMovie1714276995104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "release_year"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "release_year" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "release_year"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "release_year" character varying NOT NULL`);
    }

}
