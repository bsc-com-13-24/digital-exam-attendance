import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEmailVerificationToUsers1620000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    if (table && !table.findColumnByName('email_verified')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'email_verified',
          type: 'number',
          isNullable: false,
          default: 0,
          comment: 'Email verification status',
        }),
      );
    }

    if (table && !table.findColumnByName('verification_token')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'verification_token',
          type: 'varchar2',
          length: '500',
          isNullable: true,
          comment: 'Email verification token',
        }),
      );
    }

    if (table && !table.findColumnByName('verification_token_expiry')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'verification_token_expiry',
          type: 'timestamp',
          isNullable: true,
          comment: 'Email verification token expiration time',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    if (table && table.findColumnByName('email_verified')) {
      await queryRunner.dropColumn('users', 'email_verified');
    }

    if (table && table.findColumnByName('verification_token')) {
      await queryRunner.dropColumn('users', 'verification_token');
    }

    if (table && table.findColumnByName('verification_token_expiry')) {
      await queryRunner.dropColumn('users', 'verification_token_expiry');
    }
  }
}
