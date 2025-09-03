/*
  Warnings:

  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentorship_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `phases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `currentPhase` on the `mentorship_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `mentorship_programs` table. All the data in the column will be lost.
  - You are about to alter the column `duration` on the `mentorship_programs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `category` to the `mentorship_programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentorId` to the `mentorship_programs` table without a default value. This is not possible if the table is not empty.
  - Made the column `maxStudents` on table `mentorship_programs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "mentorship_progress_enrollmentId_lessonId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "lessons";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "mentorship_progress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "phases";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "mentors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "hourlyRate" REAL NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mentors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mentorship_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "meetingUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mentorship_sessions_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "mentorship_enrollments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "mentorship_sessions_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mentor_reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mentor_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "mentor_reviews_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "mentor_reviews_programId_fkey" FOREIGN KEY ("programId") REFERENCES "mentorship_programs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_mentorship_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "paymentId" TEXT,
    "paymentStatus" TEXT,
    "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "progress" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "mentorship_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "mentorship_enrollments_programId_fkey" FOREIGN KEY ("programId") REFERENCES "mentorship_programs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_mentorship_enrollments" ("completedAt", "enrolledAt", "id", "paymentId", "paymentStatus", "programId", "progress", "status", "userId") SELECT "completedAt", "enrolledAt", "id", "paymentId", "paymentStatus", "programId", "progress", "status", "userId" FROM "mentorship_enrollments";
DROP TABLE "mentorship_enrollments";
ALTER TABLE "new_mentorship_enrollments" RENAME TO "mentorship_enrollments";
CREATE UNIQUE INDEX "mentorship_enrollments_userId_programId_key" ON "mentorship_enrollments"("userId", "programId");
CREATE TABLE "new_mentorship_programs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "maxStudents" INTEGER NOT NULL,
    "currentStudents" INTEGER NOT NULL DEFAULT 0,
    "mentorId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mentorship_programs_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_mentorship_programs" ("createdAt", "description", "duration", "id", "isActive", "maxStudents", "price", "title", "updatedAt") SELECT "createdAt", "description", "duration", "id", "isActive", "maxStudents", "price", "title", "updatedAt" FROM "mentorship_programs";
DROP TABLE "mentorship_programs";
ALTER TABLE "new_mentorship_programs" RENAME TO "mentorship_programs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "mentors_userId_key" ON "mentors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_reviews_userId_mentorId_programId_key" ON "mentor_reviews"("userId", "mentorId", "programId");
