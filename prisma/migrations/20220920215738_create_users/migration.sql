-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "sessionId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL
);
