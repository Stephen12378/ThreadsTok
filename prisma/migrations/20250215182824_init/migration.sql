/*
  Warnings:

  - Changed the type of `postId` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "postId",
ADD COLUMN     "postId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "posts_postId_key" ON "posts"("postId");

-- CreateIndex
CREATE INDEX "posts_postId_idx" ON "posts"("postId");
