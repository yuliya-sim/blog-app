import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CommentInit1713785672538 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'comments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                    },
                    {
                        name: 'blogId',
                        type: 'uuid',
                    },
                    {
                        name: 'postId',
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
                        onUpdate: 'now()',
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
                        columnNames: ['userId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'users',
                    },
                    {
                        columnNames: ['blogId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'blogs',
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['postId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'posts',
                        onDelete: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comments');
    }
}
