import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum UserRole {
	ADMIN = 'admin',
	INSTRUCTOR = 'instructor',
	STUDENT = 'student',
}

export enum UserStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	PENDING = 'pending',
	SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true, length: 100 })
	email: string;

	@Column({ length: 100 })
	firstName: string;

	@Column({ length: 100 })
	lastName: string;

	@Column({ type: 'varchar', nullable: true, unique: true })
	googleId: string | null;

	@Column({ type: 'varchar', nullable: true, unique: true })
	appleId: string | null;

	@Column({ type: 'varchar', nullable: true })
	@Exclude()
	password: string | null;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.STUDENT,
	})
	role: UserRole;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.PENDING,
	})
	status: UserStatus;

	@Column({ type: 'varchar', length: 20, nullable: true })
	phone: string | null;

	@Column({ type: 'date', nullable: true })
	dateOfBirth: Date | null;

	@Column({ type: 'varchar', length: 255, nullable: true })
	address: string | null;

	@Column({ type: 'varchar', length: 10, nullable: true })
	postalCode: string | null;

	@Column({ type: 'varchar', length: 100, nullable: true })
	city: string | null;

	@Column({ type: 'varchar', length: 100, nullable: true })
	country: string | null;

	@Column({ type: 'varchar', nullable: true })
	@Exclude()
	passwordResetToken: string | null;

	@Column({ type: 'timestamp', nullable: true })
	@Exclude()
	passwordResetExpires: Date | null;

	@Column({ type: 'timestamp', nullable: true })
	@Exclude()
	emailVerifiedAt: Date | null;

	@Column({ type: 'varchar', nullable: true })
	@Exclude()
	emailVerificationToken: string | null;

	@Column({ type: 'timestamp', nullable: true })
	lastLoginAt: Date | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword(): Promise<void> {
		if (this.password && !this.password.startsWith('$2b$')) {
			const saltRounds = 12;
			this.password = await bcrypt.hash(this.password, saltRounds);
		}
	}

	async comparePassword(plainPassword: string): Promise<boolean> {
		if (!this.password) return false;
		return bcrypt.compare(plainPassword, this.password);
	}

	get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	get isActive(): boolean {
		return this.status === UserStatus.ACTIVE;
	}

	get isEmailVerified(): boolean {
		return this.emailVerifiedAt !== null;
	}
}
