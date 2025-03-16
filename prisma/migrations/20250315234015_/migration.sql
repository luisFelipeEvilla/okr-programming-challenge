/*
  Warnings:

  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StreetAddressKind" AS ENUM ('HOME', 'WORK', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company_name" TEXT,
    "phone_number" TEXT,
    "anniversary" TIMESTAMP(3),
    "birthday_month" INTEGER,
    "birthday_day" INTEGER,
    "street_address" TEXT,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreetAddress" (
    "id" TEXT NOT NULL,
    "kind" "StreetAddressKind" NOT NULL DEFAULT 'HOME',
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreetAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");
