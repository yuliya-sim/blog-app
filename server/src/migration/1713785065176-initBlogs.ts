import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitBlogs1713785065176 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'blogs',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'topic',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'authorId',
                        type: 'uuid',
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
                foreignKeys: [
                    {
                        columnNames: ['authorId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'users',
                        onDelete: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('blogs');
    }
}
