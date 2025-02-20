/*
  Warnings:

  - Added the required column `voiceOver` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "voiceOver" TEXT NOT NULL;
