import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDUSERPHONE1746906432338 implements MigrationInterface {
    name = 'ADDUSERPHONE1746906432338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
