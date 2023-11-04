import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(['name', 'type']) // 复合索引
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Index() // 索引
  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
