-- Colonne de partage public des présentations (utilisée par /api/presentations/[id]/share).
ALTER TABLE "presentations" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false;
