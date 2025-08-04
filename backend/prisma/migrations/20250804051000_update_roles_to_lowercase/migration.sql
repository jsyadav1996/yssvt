-- Step 1: Add lowercase values to the enum
ALTER TYPE "UserRole" ADD VALUE 'member';
ALTER TYPE "UserRole" ADD VALUE 'manager';
ALTER TYPE "UserRole" ADD VALUE 'admin';

-- Step 2: Update existing data to use lowercase values
UPDATE "users" SET "role" = 'member' WHERE "role" = 'MEMBER';
UPDATE "users" SET "role" = 'manager' WHERE "role" = 'MANAGER';
UPDATE "users" SET "role" = 'admin' WHERE "role" = 'ADMIN';

-- Step 3: Remove uppercase values from the enum
-- Note: PostgreSQL doesn't support removing enum values directly
-- We'll need to recreate the enum type
CREATE TYPE "UserRole_new" AS ENUM ('member', 'manager', 'admin');

-- Update the column to use the new enum type
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING "role"::text::"UserRole_new";

-- Drop the old enum type
DROP TYPE "UserRole";

-- Rename the new enum type
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

-- Update the default value
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'member';
