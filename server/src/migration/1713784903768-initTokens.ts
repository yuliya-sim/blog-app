import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitTokens1713784903768 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'tokens',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
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
                    {
                        name: 'exp',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'user_Agent',
                        type: 'varchar',
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['userId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'users',
                        onDelete: 'CASCADE',
                    },
                ],
                indices: [
                    {
                        columnNames: ['token'],
                        isUnique: true,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('tokens');
    }
}
