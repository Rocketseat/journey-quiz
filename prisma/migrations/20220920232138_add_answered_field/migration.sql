-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SubmissionQuestionAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerId" TEXT,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubmissionQuestionAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubmissionQuestionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubmissionQuestionAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SubmissionQuestionAnswer" ("answerId", "createdAt", "id", "questionId", "submissionId") SELECT "answerId", "createdAt", "id", "questionId", "submissionId" FROM "SubmissionQuestionAnswer";
DROP TABLE "SubmissionQuestionAnswer";
ALTER TABLE "new_SubmissionQuestionAnswer" RENAME TO "SubmissionQuestionAnswer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
