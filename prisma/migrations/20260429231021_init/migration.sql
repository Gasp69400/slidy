-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('STARTER', 'PRO', 'TEAM');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PRESENTATION', 'WHITEBOARD', 'DOCUMENT', 'NOTES', 'VISUAL_PAGE', 'MARKETING_PRESENTATION', 'CV_COVER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'GENERATING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('TITLE', 'HEADING', 'TEXT', 'BULLETS', 'IMAGE', 'CHART', 'QUOTE', 'CTA', 'DIVIDER');

-- CreateEnum
CREATE TYPE "ImageSource" AS ENUM ('AI', 'STOCK', 'UPLOAD');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "stripeCustomerId" TEXT,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "planTier" "PlanTier" NOT NULL DEFAULT 'STARTER',
    "colorPrimary" TEXT,
    "colorSecondary" TEXT,
    "colorAccent" TEXT,
    "colorBg" TEXT,
    "colorText" TEXT,
    "fontHeading" TEXT,
    "fontBody" TEXT,
    "previewImage" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "presentationType" TEXT NOT NULL,
    "templateSlug" TEXT NOT NULL,
    "slideCount" INTEGER NOT NULL,
    "slidesJson" TEXT NOT NULL,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'generating',
    "options" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'PRESENTATION',
    "audience" TEXT,
    "detailLevel" TEXT,
    "templateSlug" TEXT,
    "designOptions" JSONB,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_blocks" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "blockType" "BlockType" NOT NULL,
    "position" INTEGER NOT NULL,
    "contentJson" JSONB NOT NULL,
    "styleJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" "ImageSource" NOT NULL,
    "title" TEXT,
    "altText" TEXT,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "storageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generation_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT,
    "status" "GenerationStatus" NOT NULL DEFAULT 'QUEUED',
    "prompt" TEXT NOT NULL,
    "model" TEXT,
    "detailLevel" TEXT,
    "requestedType" "DocumentType" NOT NULL DEFAULT 'PRESENTATION',
    "optionsJson" JSONB,
    "resultJson" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "templates_slug_key" ON "templates"("slug");

-- CreateIndex
CREATE INDEX "presentations_userId_createdAt_idx" ON "presentations"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ai_documents_userId_type_createdAt_idx" ON "ai_documents"("userId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "ai_documents_status_idx" ON "ai_documents"("status");

-- CreateIndex
CREATE INDEX "document_blocks_documentId_idx" ON "document_blocks"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "document_blocks_documentId_position_key" ON "document_blocks"("documentId", "position");

-- CreateIndex
CREATE INDEX "media_assets_userId_source_createdAt_idx" ON "media_assets"("userId", "source", "createdAt");

-- CreateIndex
CREATE INDEX "generation_jobs_userId_status_createdAt_idx" ON "generation_jobs"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "generation_jobs_documentId_idx" ON "generation_jobs"("documentId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_documents" ADD CONSTRAINT "ai_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_blocks" ADD CONSTRAINT "document_blocks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ai_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generation_jobs" ADD CONSTRAINT "generation_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generation_jobs" ADD CONSTRAINT "generation_jobs_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ai_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
