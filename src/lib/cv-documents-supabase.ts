import type { SupabaseClient } from '@supabase/supabase-js'

export const CV_DOCUMENTS_TABLE = 'cv_documents'

export type CvDocumentRow = {
  id: string
  user_id: string
  title: string
  topic: string
  template_slug: string | null
  design_options: Record<string, unknown>
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

/** Format attendu par l’éditeur CV (proche de l’ancien modèle Prisma). */
export function mapCvRowToApiDocument(row: CvDocumentRow) {
  return {
    id: row.id,
    title: row.title,
    topic: row.topic,
    type: 'CV_COVER' as const,
    status: 'READY' as const,
    templateSlug: row.template_slug,
    designOptions: row.design_options,
    metadata: row.metadata,
    blocks: [] as unknown[],
    _count: { blocks: 0 },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function supabaseConfigErrorMessage(err: { message?: string } | null) {
  const msg = err?.message ?? ''
  if (
    msg.includes('relation') &&
    msg.includes('does not exist') &&
    msg.includes('cv_documents')
  ) {
    return {
      status: 503 as const,
      body: {
        error:
          'La table public.cv_documents est absente. Exécutez le script supabase/sql/cv_documents.sql (ou la migration Supabase) sur votre projet.',
      },
    }
  }
  if (
    msg.includes('Could not find the table') &&
    msg.includes('public.cv_documents')
  ) {
    return {
      status: 503 as const,
      body: {
        error:
          "La table 'public.cv_documents' n'est pas visible dans Supabase. Vérifiez le schéma public et appliquez le script supabase/sql/cv_documents.sql.",
      },
    }
  }
  if (msg.includes('JWT') || msg.includes('permission denied')) {
    return {
      status: 403 as const,
      body: { error: 'Accès refusé aux documents CV.' },
    }
  }
  return {
    status: 500 as const,
    body: { error: msg || 'Erreur Supabase lors de l’accès aux CV.' },
  }
}

export async function listCvDocuments(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ data: CvDocumentRow[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from(CV_DOCUMENTS_TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return {
    data: data as CvDocumentRow[] | null,
    error: error ? new Error(error.message) : null,
  }
}

export async function getCvDocumentById(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<{ data: CvDocumentRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from(CV_DOCUMENTS_TABLE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  return {
    data: data as CvDocumentRow | null,
    error: error ? new Error(error.message) : null,
  }
}

export async function insertCvDocument(
  supabase: SupabaseClient,
  row: {
    id: string
    user_id: string
    title: string
    topic: string
    template_slug: string | null
    design_options: Record<string, unknown>
    metadata: Record<string, unknown>
  },
): Promise<{ data: { id: string } | null; error: Error | null }> {
  const { data, error } = await supabase
    .from(CV_DOCUMENTS_TABLE)
    .insert(row)
    .select('id')
    .single()

  return {
    data: data as { id: string } | null,
    error: error ? new Error(error.message) : null,
  }
}

export async function updateCvDocument(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  patch: {
    title?: string
    topic?: string
    template_slug?: string | null
    design_options?: Record<string, unknown>
    metadata?: Record<string, unknown>
  },
): Promise<{ data: CvDocumentRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from(CV_DOCUMENTS_TABLE)
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()

  return {
    data: data as CvDocumentRow | null,
    error: error ? new Error(error.message) : null,
  }
}

export async function deleteCvDocument(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from(CV_DOCUMENTS_TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  return { error: error ? new Error(error.message) : null }
}
