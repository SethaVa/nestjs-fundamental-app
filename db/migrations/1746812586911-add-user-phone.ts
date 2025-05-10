import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhone1746812586911 implements MigrationInterface {
    name = 'AddUserPhone1746812586911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
