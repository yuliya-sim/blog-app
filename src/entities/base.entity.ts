import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: true, name: 'is_Active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_Archived' })
  isArchived: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'create_Date_Time',
  })
  createDateTime: Date;


  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_Changed_Date_Time',
  })
  lastChangedDateTime: Date;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    name: 'last_Changed_By',
  })
  lastChangedBy: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    name: 'internal_Comment',
  })
  internalComment: string | null;
}
