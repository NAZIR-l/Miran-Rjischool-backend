export declare enum UserRole {
    ADMIN = "admin",
    INSTRUCTOR = "instructor",
    STUDENT = "student"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    SUSPENDED = "suspended"
}
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    googleId: string | null;
    appleId: string | null;
    password: string | null;
    role: UserRole;
    status: UserStatus;
    phone: string | null;
    dateOfBirth: Date | null;
    address: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    emailVerifiedAt: Date | null;
    emailVerificationToken: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    comparePassword(plainPassword: string): Promise<boolean>;
    get fullName(): string;
    get isActive(): boolean;
    get isEmailVerified(): boolean;
}
