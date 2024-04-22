import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitPosts1713785341090 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'posts',
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
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'blogId',
                        type: 'uuid',
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
                        columnNames: ['blogId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'blogs',
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['authorId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'users',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('posts');
    }
}
