# Slidy

Application **Next.js 14** : présentations IA, studio CV / lettre de motivation, templates, facturation Stripe, auth Supabase.

## Prérequis

- Node.js 18+
- Projet Supabase (URL, clé anon, `SUPABASE_DATABASE_URL` pour Prisma)
- Optionnel : `GROQ_API_KEY` (génération IA), clés Stripe

## Installation

```bash
cp .env.example .env.local
# Renseigner les variables (voir .env.example)

npm install
npx prisma generate
npx prisma migrate dev   # applique les migrations, dont la suppression des tables « immobilier » si présentes
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts utiles

| Script | Rôle |
|--------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Production |
| `npm run prisma:migrate` | Migrations Prisma |
| `npm run type-check` | Vérification TypeScript |

## Base de données

Le schéma Prisma (`prisma/schema.prisma`) couvre utilisateurs, présentations, documents IA, blocs, médias et jobs de génération. Les anciennes tables annonces (clients, propriétés, matching, alertes) sont retirées du schéma ; la migration `20260427120000_remove_estate_tables` les supprime côté PostgreSQL lorsque vous l’appliquez.

## Licence

Projet privé.
