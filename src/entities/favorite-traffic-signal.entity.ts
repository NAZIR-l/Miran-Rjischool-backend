import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity('favorite_traffic_signals')
export class FavoriteTrafficSignal {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid' })
	userId: string;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column({ type: 'varchar', length: 100 })
	signalId: string;

	@Column({ type: 'varchar', length: 200 })
	signalName: string;

	@Column({ type: 'varchar', length: 100 })
	signalType: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	signalImageUrl: string | null; // Stores signal ID (e.g., "trw1"), not full URL

	@CreateDateColumn()
	createdAt: Date;
}

