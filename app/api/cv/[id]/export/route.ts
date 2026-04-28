import { NextRequest, NextResponse } from 'next/server'

import { exportCvCoverToPdf } from '@/lib/cv-export-pdf'
import { parseCvDesignOptions, parseCvMetadata } from '@/lib/cv-schema'
import {
  getCvDocumentById,
  supabaseConfigErrorMessage,
} from '@/lib/cv-documents-supabase'
import { requireSupabaseSession } from '@/lib/supabase/require-supabase-session'

type Params = { params: { id: string } }

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await requireSupabaseSession()
  if (!session.ok) return session.response

  const { data: row, error } = await getCvDocumentById(
    session.supabase,
    session.userId,
    params.id,
  )
  if (error) {
    const cfg = supabaseConfigErrorMessage(error)
    return NextResponse.json(cfg.body, { status: cfg.status })
  }
  if (!row) {
    return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
  }

  const meta = parseCvMetadata(row.metadata)
  if (!meta) {
    return NextResponse.json(
      { error: 'Métadonnées CV invalides ou manquantes.' },
      { status: 500 },
    )
  }
  const design = parseCvDesignOptions(row.design_options)
  const buffer = await exportCvCoverToPdf({ design, metadata: meta })

  return new NextResponse(buffer as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeName(row.title)}.pdf"`,
    },
  })
}

function safeName(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-_ ]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'cv'
  )
}
