-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "author" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "slides" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_postId_key" ON "posts"("postId");

-- CreateIndex
CREATE INDEX "posts_postId_idx" ON "posts"("postId");

-- CreateIndex
CREATE INDEX "posts_source_idx" ON "posts"("source");
