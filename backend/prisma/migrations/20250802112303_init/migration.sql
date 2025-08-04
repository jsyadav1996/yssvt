-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MEMBER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cash');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('USD', 'EUR', 'GBP', 'INR');

-- CreateEnum
CREATE TYPE "public"."DonationStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "role" "public"."UserRole" DEFAULT 'MEMBER',
    "phone" VARCHAR(20),
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "organizerId" INTEGER NOT NULL,
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "image" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."donations" (
    "id" SERIAL NOT NULL,
    "donorId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" "public"."Currency" NOT NULL DEFAULT 'USD',
    "purpose" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "status" "public"."DonationStatus" NOT NULL DEFAULT 'pending',
    "transactionId" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "donations_transactionId_key" ON "public"."donations"("transactionId");

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."donations" ADD CONSTRAINT "donations_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
