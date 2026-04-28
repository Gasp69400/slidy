'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'

import { CvPreview } from '@/components/cv/CvPreview'
import { CvTemplatePicker } from '@/components/cv/CvTemplatePicker'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  cvKitSchema,
  defaultCvDesignOptions,
  parseCvDesignOptions,
  parseCvMetadata,
  type CvDesignOptions,
  type CvDocumentMetadata,
  type CvFontFamily,
  type CvKit,
  type CvLayoutDensity,
} from '@/lib/cv-schema'
import { useSiteLocale } from '@/lib/site-locale'

type Doc = {
  id: string
  title: string
  type: string
  metadata: unknown
  designOptions: unknown
}

export default function CvEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t, locale } = useSiteLocale()

  const [kit, setKit] = useState<CvKit | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [design, setDesign] = useState<CvDesignOptions>(defaultCvDesignOptions())
  const [baseMeta, setBaseMeta] = useState<Partial<CvDocumentMetadata>>({})
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle')

  const { data, isLoading, error } = useQuery({
    queryKey: ['cv-document', id],
    queryFn: async () => {
      const res = await fetch(`/api/cv/${id}`, { credentials: 'include' })
      if (!res.ok) throw new Error('load')
      const json = await res.json()
      return json.data as Doc
    },
    enabled: Boolean(id),
  })

  useEffect(() => {
    if (!data) return
    if (data.type !== 'CV_COVER') {
      router.replace(`/studio/${data.id}`)
      return
    }
    const meta = parseCvMetadata(data.metadata)
    if (!meta) return
    setKit(meta.cvKit)
    setCoverLetter(meta.coverLetter)
    setDesign(parseCvDesignOptions(data.designOptions))
    setBaseMeta({
      source: meta.source,
      lastPrompt: meta.lastPrompt,
      locale: meta.locale,
    })
  }, [data, router])

  const buildMetadata = useCallback((): CvDocumentMetadata | null => {
    if (!kit) return null
    const cleanedKit: CvKit = {
      ...kit,
      experience: kit.experience.filter(
        (e) => e.role.trim() && e.company.trim(),
      ),
      education: kit.education.filter(
        (e) => e.degree.trim() && e.school.trim(),
      ),
      skills: kit.skills.filter((g) => g.name.trim() && g.items.length > 0),
    }
    if (!cleanedKit.skills.length) {
      cleanedKit.skills = [
        { name: 'Compétences', items: ['—'] },
      ]
    }
    return {
      version: 1,
      cvKit: cvKitSchema.parse(cleanedKit),
      coverLetter,
      source: baseMeta.source ?? 'manual',
      lastPrompt: baseMeta.lastPrompt,
      locale: baseMeta.locale,
    }
  }, [kit, coverLetter, baseMeta])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const metadata = buildMetadata()
      if (!metadata) throw new Error('no kit')
      const res = await fetch(`/api/cv/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: metadata.cvKit.profile.fullName
            ? `${metadata.cvKit.profile.fullName} — CV`
            : undefined,
          metadata: metadata as object,
          designOptions: design as object,
          templateSlug: design.templateSlug,
        }),
      })
      if (!res.ok) throw new Error('save')
      return res.json()
    },
    onSuccess: () => {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
      void queryClient.invalidateQueries({ queryKey: ['cv-document', id] })
      void queryClient.invalidateQueries({ queryKey: ['cv-documents'] })
    },
  })

  const exportPdf = async () => {
    const res = await fetch(`/api/cv/${id}/export?format=pdf`, {
      credentials: 'include',
    })
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(data?.title ?? 'cv').replace(/\s+/g, '-')}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-red-600">
        {t('cv.err_load')}
        <div className="mt-4">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/studio/cv">{t('cv.back_studio')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (data.type !== 'CV_COVER') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!kit) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-red-600">
        {t('cv.err_load')}
        <div className="mt-4">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/studio/cv">{t('cv.back_studio')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const setProfile = (patch: Partial<CvKit['profile']>) => {
    setKit((k) =>
      k
        ? {
            ...k,
            profile: { ...k.profile, ...patch },
          }
        : k,
    )
  }

  const setContact = (patch: Partial<NonNullable<CvKit['profile']['contact']>>) => {
    setKit((k) =>
      k
        ? {
            ...k,
            profile: {
              ...k.profile,
              contact: { ...k.profile.contact, ...patch },
            },
          }
        : k,
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-6 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 lg:flex-row">
        <div className="lg:w-[340px] lg:flex-shrink-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href="/studio/cv">
                <ArrowLeft className="mr-1 h-4 w-4" />
                {t('cv.back_studio')}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href="/studio">{t('editor.back')}</Link>
            </Button>
          </div>
          <Card className="rounded-3xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {t('cv.editor_title')}
            </h1>
            <Tabs defaultValue="preview" className="mt-4">
              <TabsList className="grid w-full grid-cols-3 rounded-xl bg-slate-100 p-1 text-xs dark:bg-slate-800">
                <TabsTrigger value="preview" className="rounded-lg">
                  {t('cv.tab_preview')}
                </TabsTrigger>
                <TabsTrigger value="letter" className="rounded-lg">
                  {t('cv.tab_letter')}
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg">
                  {t('cv.tab_settings')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4 space-y-3">
                <div>
                  <Label>{t('cv.manual_name')}</Label>
                  <Input
                    className="mt-1 rounded-xl"
                    value={kit.profile.fullName}
                    onChange={(e) => setProfile({ fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t('cv.manual_headline')}</Label>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {t('cv.cv_object_label')} — {locale === 'fr' ? 'affiché en grand en haut de l’aperçu' : 'shown large at the top'}
                  </p>
                  <Input
                    className="mt-1 rounded-xl"
                    value={kit.profile.headline}
                    onChange={(e) => setProfile({ headline: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t('cv.search_period')}</Label>
                  <Input
                    className="mt-1 rounded-xl"
                    placeholder={
                      locale === 'fr'
                        ? 'Ex. : CDI dès septembre 2025'
                        : 'e.g. Full-time from Sept 2025'
                    }
                    value={kit.profile.searchPeriod ?? ''}
                    onChange={(e) =>
                      setProfile({
                        searchPeriod: e.target.value || undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t('cv.manual_summary')}</Label>
                  <Textarea
                    className="mt-1 min-h-[100px] rounded-xl"
                    value={kit.profile.summary}
                    onChange={(e) => setProfile({ summary: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t('cv.manual_interests')}</Label>
                  <Textarea
                    className="mt-1 min-h-[72px] rounded-xl"
                    value={kit.profile.interests ?? ''}
                    onChange={(e) =>
                      setProfile({
                        interests: e.target.value.trim()
                          ? e.target.value
                          : undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t('cv.photo')}</Label>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <input
                      id="cv-photo-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          const data = String(reader.result ?? '')
                          if (data) setProfile({ photoUrl: data })
                        }
                        reader.readAsDataURL(file)
                        e.target.value = ''
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs"
                      onClick={() =>
                        document.getElementById('cv-photo-upload')?.click()
                      }
                    >
                      {t('cv.photo_pick')}
                    </Button>
                    {kit.profile.photoUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-xs text-red-600"
                        onClick={() => setProfile({ photoUrl: undefined })}
                      >
                        {t('cv.photo_clear')}
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Email</Label>
                    <Input
                      className="mt-1 rounded-xl"
                      value={kit.profile.contact?.email ?? ''}
                      onChange={(e) => setContact({ email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Tél.</Label>
                    <Input
                      className="mt-1 rounded-xl"
                      value={kit.profile.contact?.phone ?? ''}
                      onChange={(e) => setContact({ phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>{t('cv.contact.location')}</Label>
                    <Input
                      className="mt-1 rounded-xl"
                      value={kit.profile.contact?.location ?? ''}
                      onChange={(e) => setContact({ location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t('cv.contact.linkedin')}</Label>
                    <Input
                      className="mt-1 rounded-xl"
                      value={kit.profile.contact?.linkedin ?? ''}
                      onChange={(e) => setContact({ linkedin: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Label className="text-slate-700 dark:text-slate-300">
                    {t('cv.sec.experience')}
                  </Label>
                  <div className="mt-2 space-y-3">
                    {kit.experience.map((ex, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <Input
                          className="mb-1 rounded-lg text-sm"
                          placeholder="Rôle"
                          value={ex.role}
                          onChange={(e) => {
                            const next = [...kit.experience]
                            next[i] = { ...next[i], role: e.target.value }
                            setKit({ ...kit, experience: next })
                          }}
                        />
                        <Input
                          className="mb-1 rounded-lg text-sm"
                          placeholder="Entreprise"
                          value={ex.company}
                          onChange={(e) => {
                            const next = [...kit.experience]
                            next[i] = { ...next[i], company: e.target.value }
                            setKit({ ...kit, experience: next })
                          }}
                        />
                        <Input
                          className="mb-1 rounded-lg text-sm"
                          placeholder="Période"
                          value={ex.period}
                          onChange={(e) => {
                            const next = [...kit.experience]
                            next[i] = { ...next[i], period: e.target.value }
                            setKit({ ...kit, experience: next })
                          }}
                        />
                        <Textarea
                          className="rounded-lg text-xs"
                          placeholder="Puces (une ligne = une puce)"
                          value={ex.bullets.join('\n')}
                          onChange={(e) => {
                            const bullets = e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean)
                            const next = [...kit.experience]
                            next[i] = { ...next[i], bullets }
                            setKit({ ...kit, experience: next })
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl text-xs"
                      onClick={() =>
                        setKit({
                          ...kit,
                          experience: [
                            ...kit.experience,
                            {
                              role: '',
                              company: '',
                              period: '',
                              bullets: [],
                            },
                          ],
                        })
                      }
                    >
                      + {t('cv.sec.experience')}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="letter" className="mt-4">
                <Label>{t('cv.tab_letter')}</Label>
                <Textarea
                  className="mt-1 min-h-[220px] rounded-xl"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-4 space-y-4">
                <div>
                  <Label>{t('cv.templates')}</Label>
                  <div className="mt-2">
                    <CvTemplatePicker
                      value={design.templateSlug}
                      onChange={(slug) =>
                        setDesign((d) => ({ ...d, templateSlug: slug }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>{t('cv.font')}</Label>
                  <Select
                    value={design.fontFamily}
                    onValueChange={(v) =>
                      setDesign((d) => ({ ...d, fontFamily: v as CvFontFamily }))
                    }
                  >
                    <SelectTrigger className="mt-1 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">{t('cv.font.inter')}</SelectItem>
                      <SelectItem value="georgia">{t('cv.font.georgia')}</SelectItem>
                      <SelectItem value="source">{t('cv.font.source')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('cv.layout')}</Label>
                  <Select
                    value={design.layoutDensity}
                    onValueChange={(v) =>
                      setDesign((d) => ({
                        ...d,
                        layoutDensity: v as CvLayoutDensity,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">{t('cv.layout.compact')}</SelectItem>
                      <SelectItem value="normal">{t('cv.layout.normal')}</SelectItem>
                      <SelectItem value="spacious">{t('cv.layout.spacious')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('cv.accent')}</Label>
                  <Input
                    type="color"
                    className="mt-1 h-10 w-full cursor-pointer rounded-xl"
                    value={design.accentHex}
                    onChange={(e) =>
                      setDesign((d) => ({ ...d, accentHex: e.target.value }))
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Button
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
              >
                {saveMutation.isPending ? '…' : t('cv.save')}
              </Button>
              {saveState === 'saved' && (
                <p className="text-center text-xs text-emerald-600">{t('cv.saved')}</p>
              )}
              {saveMutation.isError && (
                <p className="text-center text-xs text-red-600">{t('cv.err_save')}</p>
              )}
              <Button
                variant="outline"
                className="rounded-xl"
                type="button"
                onClick={() => void exportPdf()}
              >
                <Download className="mr-2 h-4 w-4" />
                {t('cv.export_pdf')}
              </Button>
            </div>
          </Card>
        </div>

        <div className="min-w-0 flex-1">
          <CvPreview kit={kit} design={design} className="min-h-[640px]" />
        </div>
      </div>
    </div>
  )
}
