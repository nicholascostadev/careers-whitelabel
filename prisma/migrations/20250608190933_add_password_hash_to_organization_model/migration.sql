/*
  Warnings:

  - Added the required column `passwordHash` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "passwordHash" TEXT NOT NULL;
