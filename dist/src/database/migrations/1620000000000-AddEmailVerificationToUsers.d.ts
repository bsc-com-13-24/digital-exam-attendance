import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddEmailVerificationToUsers1620000000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
