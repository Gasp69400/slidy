-- Plan payé (Pro / Ultimate) distinct du statut d'abonnement Stripe
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "planTier" "PlanTier" NOT NULL DEFAULT 'STARTER';

-- Utilisateurs déjà actifs : conserver l'accès haut de gamme en attendant resync Stripe
UPDATE "users"
SET "planTier" = 'ULTIMATE'
WHERE "subscriptionStatus" = 'ACTIVE' AND "planTier" = 'STARTER';
