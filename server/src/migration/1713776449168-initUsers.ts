import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitUsers1713776449167 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '300',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'first_name',
                        type: 'varchar',
                        length: '300',
                        isNullable: true,
                    },
                    {
                        name: 'last_name',
                        type: 'varchar',
                        length: '300',
                        isNullable: true,
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                        length: '300',
                        isNullable: true,
                    },
                    {
                        name: 'create_date_time',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'last_changed_date_time',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'last_changed_by',
                        type: 'varchar',
                        length: '300',
                        isNullable: true,
                    },
                    {
                        name: 'internal_comment',
                        type: 'varchar',
                        length: '300',
                        isNullable: true,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
