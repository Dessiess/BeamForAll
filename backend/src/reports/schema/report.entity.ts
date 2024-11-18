/* eslint-disable prettier/prettier */
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('reports')
export class Report {
  @ObjectIdColumn()
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  company_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  rn: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  material_type: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  package_number: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'varchar', length: 50, nullable: false })
  start_time: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  end_time: string;

  @Column({ type: 'timestamp', nullable: true })
  arrival_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  ready_time: Date;
}
