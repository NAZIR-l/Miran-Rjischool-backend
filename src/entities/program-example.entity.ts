import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('program_examples')
export class ProgramExample {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    programId: string;

    @ManyToOne('Program', (program: any) => program.examples, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'programId' })
    program: any;

    @Column({ type: 'varchar', length: 160 })
    title: string;

    @Column({ type: 'int', default: 0 })
    orderIndex: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    questionsFile: string | null; // path relative to src/questions, e.g. "program-1/example-1.json"

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}


