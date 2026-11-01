-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastActive" TIMESTAMP(3),
    "tier1Progress" JSONB,
    "sqlProgress" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpentSeconds" INTEGER NOT NULL,
    "hintsUsedCount" INTEGER NOT NULL DEFAULT 0,
    "totalScorePercentage" DOUBLE PRECISION NOT NULL,
    "passedTestsCount" INTEGER NOT NULL DEFAULT 0,
    "totalTestsCount" INTEGER NOT NULL DEFAULT 0,
    "submittedCode" TEXT,
    "rootCauseAnalysis" TEXT,
    "immediateMitigation" TEXT,
    "permanentFix" TEXT,
    "testingStrategy" TEXT,
    "monitoringPlan" TEXT,
    "systemDesignNotes" JSONB,
    "interviewAnswers" JSONB,
    "rubricScores" JSONB NOT NULL,
    "failedTestCases" JSONB,
    "selfAssessmentDone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ScenarioAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ScenarioAttempt_userId_scenarioId_idx" ON "ScenarioAttempt"("userId", "scenarioId");

-- CreateIndex
CREATE INDEX "ScenarioAttempt_scenarioId_idx" ON "ScenarioAttempt"("scenarioId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_scenarioId_key" ON "Bookmark"("userId", "scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNote_userId_scenarioId_key" ON "UserNote"("userId", "scenarioId");

-- AddForeignKey
ALTER TABLE "ScenarioAttempt" ADD CONSTRAINT "ScenarioAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNote" ADD CONSTRAINT "UserNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
