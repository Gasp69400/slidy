import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PublicPresentationClient from './PublicPresentationClient'

type Props = { params: { id: string } }

export default async function PublicPresentationPage({ params }: Props) {
  const presentation = await prisma.presentation.findFirst({
    where: { id: params.id, isPublic: true },
  })

  if (!presentation) return notFound()

  return <PublicPresentationClient presentation={presentation} />
}
