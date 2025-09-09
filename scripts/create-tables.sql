-- Create NextAuth.js required tables
CREATE TABLE IF NOT EXISTS "account" (
  "userId" UUID NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "provider" VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" VARCHAR(255),
  "scope" VARCHAR(255),
  "id_token" TEXT,
  "session_state" VARCHAR(255),
  CONSTRAINT "account_pkey" PRIMARY KEY ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "session" (
  "sessionToken" VARCHAR(255) NOT NULL,
  "userId" UUID NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sessionToken")
);

CREATE TABLE IF NOT EXISTS "verificationToken" (
  "identifier" VARCHAR(255) NOT NULL,
  "token" VARCHAR(255) NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  CONSTRAINT "verificationToken_pkey" PRIMARY KEY ("identifier", "token")
);

-- Create indexes for NextAuth.js tables
CREATE INDEX IF NOT EXISTS "account_provider_providerAccountId_idx" ON "account" ("provider", "providerAccountId");

CREATE INDEX IF NOT EXISTS "verificationToken_identifier_token_idx" ON "verificationToken" ("identifier", "token");

-- Add foreign key constraints
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
