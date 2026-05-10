"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEmailVerificationToUsers1620000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddEmailVerificationToUsers1620000000000 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('users');
        if (table && !table.findColumnByName('email_verified')) {
            await queryRunner.addColumn('users', new typeorm_1.TableColumn({
                name: 'email_verified',
                type: 'number',
                isNullable: false,
                default: 0,
                comment: 'Email verification status',
            }));
        }
        if (table && !table.findColumnByName('verification_token')) {
            await queryRunner.addColumn('users', new typeorm_1.TableColumn({
                name: 'verification_token',
                type: 'varchar2',
                length: '500',
                isNullable: true,
                comment: 'Email verification token',
            }));
        }
        if (table && !table.findColumnByName('verification_token_expiry')) {
            await queryRunner.addColumn('users', new typeorm_1.TableColumn({
                name: 'verification_token_expiry',
                type: 'timestamp',
                isNullable: true,
                comment: 'Email verification token expiration time',
            }));
        }
    }
    async down(queryRunner) {
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
exports.AddEmailVerificationToUsers1620000000000 = AddEmailVerificationToUsers1620000000000;
//# sourceMappingURL=1620000000000-AddEmailVerificationToUsers.js.map