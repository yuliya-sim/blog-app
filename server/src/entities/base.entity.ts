import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'create_date_time',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_changed_date_time',
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    name: 'last_changed_by',
  })
  lastChangedBy: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    name: 'internal_comment',
  })
  internalComment: string | null;
}
