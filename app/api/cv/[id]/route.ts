import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  getCvDocumentById,
  mapCvRowToApiDocument,
  supabaseConfigErrorMessage,
  updateCvDocument,
} from '@/lib/cv-documents-supabase'
import { requireSupabaseSession } from '@/lib/supabase/require-supabase-session'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  topic: z.string().min(1).optional(),
  templateSlug: z.string().nullable().optional(),
  designOptions: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
})

type Params = { params: { id: string } }

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await requireSupabaseSession()
  if (!session.ok) return session.response

  const { data, error } = await getCvDocumentById(
    session.supabase,
    session.userId,
    params.id,
  )
  if (error) {
    const cfg = supabaseConfigErrorMessage(error)
    return NextResponse.json(cfg.body, { status: cfg.status })
  }
  if (!data) {
    return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: mapCvRowToApiDocument(data),
  })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await requireSupabaseSession()
  if (!session.ok) return session.response

  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.issues },
      { status: 400 },
    )
  }

  const p = parsed.data
  const patch: {
    title?: string
    topic?: string
    template_slug?: string | null
    design_options?: Record<string, unknown>
    metadata?: Record<string, unknown>
  } = {}
  if (p.title !== undefined) patch.title = p.title
  if (p.topic !== undefined) patch.topic = p.topic
  if (p.templateSlug !== undefined) patch.template_slug = p.templateSlug
  if (p.designOptions !== undefined) {
    patch.design_options = p.designOptions as Record<string, unknown>
  }
  if (p.metadata !== undefined) {
    patch.metadata = p.metadata as Record<string, unknown>
  }

  const { data, error } = await updateCvDocument(
    session.supabase,
    session.userId,
    params.id,
    patch,
  )
  if (error) {
    const cfg = supabaseConfigErrorMessage(error)
    return NextResponse.json(cfg.body, { status: cfg.status })
  }
  if (!data) {
    return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: mapCvRowToApiDocument(data),
  })
}
