import { redirect } from 'next/navigation'

/** Ancien chemin / tableau de bord : l’app Slidy vit sur /studio */
export default function DashboardPage() {
  redirect('/studio')
}
