-- Suppression du domaine annonces immobilières (scraping / matching).
-- Slidy : présentations & documents CV côté app.

DROP TABLE IF EXISTS "alerts" CASCADE;
DROP TABLE IF EXISTS "matches" CASCADE;
DROP TABLE IF EXISTS "search_criteria" CASCADE;
DROP TABLE IF EXISTS "properties" CASCADE;
DROP TABLE IF EXISTS "clients" CASCADE;

DROP TYPE IF EXISTS "AlertType";
DROP TYPE IF EXISTS "PropertySource";
