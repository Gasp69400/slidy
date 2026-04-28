import { NextResponse } from 'next/server'

import {
  listCvDocuments,
  mapCvRowToApiDocument,
  supabaseConfigErrorMessage,
} from '@/lib/cv-documents-supabase'
import { requireSupabaseSession } from '@/lib/supabase/require-supabase-session'

export async function GET() {
  const session = await requireSupabaseSession()
  if (!session.ok) return session.response

  const { data, error } = await listCvDocuments(session.supabase, session.userId)
  if (error) {
    const cfg = supabaseConfigErrorMessage(error)
    return NextResponse.json(cfg.body, { status: cfg.status })
  }

  const list = (data ?? []).map(mapCvRowToApiDocument)
  return NextResponse.json({ success: true, data: list })
}
