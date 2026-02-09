-- Create Group table
CREATE TABLE "Group" (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    "groupType" TEXT DEFAULT 'section',
    college TEXT NOT NULL,
    subject TEXT NOT NULL,
    "sectionNumber" TEXT NOT NULL,
    "groupLink" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    description TEXT,
    "memberCount" INTEGER DEFAULT 0,
    votes INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create GroupSubmission table
CREATE TABLE "GroupSubmission" (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    "groupType" TEXT DEFAULT 'section',
    college TEXT NOT NULL,
    subject TEXT NOT NULL,
    "sectionNumber" TEXT NOT NULL,
    "groupLink" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    description TEXT,
    "submitterName" TEXT DEFAULT 'مجهول',
    status TEXT DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Vote table
CREATE TABLE "Vote" (
    id TEXT PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("groupId", "ipAddress")
);

-- Create indexes for better performance
CREATE INDEX idx_group_college_subject_section ON "Group"(college, subject, "sectionNumber");
CREATE INDEX idx_group_platform ON "Group"(platform);
CREATE INDEX idx_submission_status ON "GroupSubmission"(status);
CREATE INDEX idx_submission_created ON "GroupSubmission"("createdAt");
CREATE INDEX idx_vote_group ON "Vote"("groupId");
