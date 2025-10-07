-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "googleId" VARCHAR UNIQUE,
    "appleId" VARCHAR UNIQUE,
    password VARCHAR,
    role VARCHAR NOT NULL DEFAULT 'student',
    status VARCHAR NOT NULL DEFAULT 'pending',
    phone VARCHAR(20),
    "dateOfBirth" DATE,
    address VARCHAR(255),
    "postalCode" VARCHAR(10),
    city VARCHAR(100),
    country VARCHAR(100),
    "passwordResetToken" VARCHAR,
    "passwordResetExpires" TIMESTAMP,
    "emailVerifiedAt" TIMESTAMP,
    "emailVerificationToken" VARCHAR,
    "lastLoginAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_googleId ON users("googleId");
CREATE INDEX IF NOT EXISTS idx_users_appleId ON users("appleId");
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Check if table was created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Create Favorite Traffic Signals Table
CREATE TABLE IF NOT EXISTS favorite_traffic_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "signalId" VARCHAR(100) NOT NULL,
    "signalName" VARCHAR(200) NOT NULL,
    "signalType" VARCHAR(100) NOT NULL,
    "signalImageUrl" VARCHAR(100), -- Stores signal ID (e.g., "trw1"), not full URL
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_signal UNIQUE ("userId", "signalId")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorite_traffic_signals_userId ON favorite_traffic_signals("userId");
CREATE INDEX IF NOT EXISTS idx_favorite_traffic_signals_signalId ON favorite_traffic_signals("signalId");

-- Check if table was created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'favorite_traffic_signals'
ORDER BY ordinal_position;

