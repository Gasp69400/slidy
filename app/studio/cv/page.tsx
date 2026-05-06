'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'

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
import type { CvFontFamily, CvLayoutDensity, CvTemplateSlug } from '@/lib/cv-schema'
import { useSiteLocale } from '@/lib/site-locale'

type ExpRow = { role: string; company: string; period: string; bullets: string }

export default function CvStudioPage() {
  const { t, locale } = useSiteLocale()
  const router = useRouter()
  const [inputMode, setInputMode] = useState<'prompt' | 'manual'>('manual')
  const [userPrompt, setUserPrompt] = useState('')
  const [fullName, setFullName] = useState('')
  const [headline, setHeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [skillsText, setSkillsText] = useState('')
  const [interestsText, setInterestsText] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [expRows, setExpRows] = useState<ExpRow[]>([
    { role: '', company: '', period: '', bullets: '' },
  ])
  const [degree, setDegree] = useState('')
  const [school, setSchool] = useState('')
  const [year, setYear] = useState('')
  const [templateSlug, setTemplateSlug] = useState<CvTemplateSlug>('modern')
  const [fontFamily, setFontFamily] = useState<CvFontFamily>('inter')
  const [layoutDensity, setLayoutDensity] = useState<CvLayoutDensity>('normal')
  const [accentHex, setAccentHex] = useState('#4f46e5')
  const [contentLocale, setContentLocale] = useState<'fr' | 'en'>(
    locale === 'en' ? 'en' : 'fr',
  )
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState('')

  const { data: capsData } = useQuery({
    queryKey: ['cv-capabilities'],
    queryFn: async () => {
      const res = await fetch('/api/cv/capabilities', { credentials: 'include' })
      if (!res.ok) throw new Error('caps')
      return res.json() as Promise<{
        success: boolean
        data: { allowedDocumentTypes: string[]; plan: string }
      }>
    },
  })

  const allowed = capsData?.data?.allowedDocumentTypes?.includes('CV_COVER')

  const generateMutation = useMutation({
    mutationFn: async () => {
      setError('')
      const experience = expRows
        .filter((r) => r.role.trim() && r.company.trim())
        .map((r) => ({
          role: r.role.trim(),
          company: r.company.trim(),
          period: r.period.trim() || '—',
          bullets: r.bullets
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
        }))
      const education =
        degree.trim() && school.trim()
          ? [{ degree: degree.trim(), school: school.trim(), year: year.trim() || undefined }]
          : undefined

      const hasManualExtra =
        Boolean(fullName.trim()) ||
        Boolean(headline.trim()) ||
        Boolean(summary.trim()) ||
        experience.length > 0 ||
        Boolean(degree.trim() && school.trim()) ||
        Boolean(skillsText.trim()) ||
        Boolean(interestsText.trim()) ||
        Boolean(photoUrl.trim()) ||
        Boolean(email.trim()) ||
        Boolean(phone.trim()) ||
        Boolean(location.trim())

      const body = {
        mode: inputMode,
        userPrompt: inputMode === 'prompt' ? userPrompt : undefined,
        manual:
          inputMode === 'manual' || hasManualExtra
            ? {
                fullName: fullName || undefined,
                headline: headline || undefined,
                summary: summary || undefined,
                interests: interestsText.trim() || undefined,
                photoUrl: photoUrl.trim() || undefined,
                contact: {
                  email: email || undefined,
                  phone: phone || undefined,
                  location: location || undefined,
                },
                experience: experience.length ? experience : undefined,
                education,
              }
            : undefined,
        skillsText: skillsText || undefined,
        jobDescription: jobDescription.trim() || undefined,
        templateSlug,
        fontFamily,
        layoutDensity,
        accentHex,
        locale: contentLocale,
      }

      const res = await fetch('/api/cv/generate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'CV generate failed')
      return json as { success: boolean; data: { documentId: string } }
    },
    onSuccess: (data) => {
      router.push(`/studio/cv/${data.data.documentId}`)
    },
    onError: (e: unknown) => {
      setError(e instanceof Error ? e.message : 'Error')
    },
  })

  const canSubmit = useMemo(() => {
    if (inputMode === 'prompt') return userPrompt.trim().length >= 12
    return (
      Boolean(fullName.trim()) ||
      Boolean(headline.trim()) ||
      Boolean(summary.trim()) ||
      expRows.some((r) => r.role.trim() && r.company.trim()) ||
      Boolean(degree.trim() && school.trim()) ||
      Boolean(skillsText.trim()) ||
      Boolean(interestsText.trim()) ||
      Boolean(photoUrl.trim()) ||
      Boolean(email.trim()) ||
      Boolean(phone.trim()) ||
      Boolean(location.trim())
    )
  }, [
    degree,
    email,
    expRows,
    fullName,
    headline,
    inputMode,
    interestsText,
    location,
    phone,
    photoUrl,
    school,
    skillsText,
    summary,
    userPrompt,
  ])

  const updateExp = (i: number, patch: Partial<ExpRow>) => {
    setExpRows((rows) =>
      rows.map((r, j) => (j === i ? { ...r, ...patch } : r)),
    )
  }

  if (capsData && allowed === false) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card className="rounded-3xl border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-700">{t('cv.upgrade')}</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href="/pricing">{t('cv.pricing')}</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 flex items-start gap-3">
          <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {t('cv.page_title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {t('cv.page_sub')}
            </p>
          </div>
        </div>

        <Card className="rounded-3xl border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Tabs
            value={inputMode}
            onValueChange={(v) => setInputMode(v as 'prompt' | 'manual')}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <TabsTrigger value="manual" className="rounded-lg text-sm">
                {t('cv.tab_manual')}
              </TabsTrigger>
              <TabsTrigger value="prompt" className="rounded-lg text-sm">
                {t('cv.tab_prompt')}
              </TabsTrigger>
            </TabsList>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <Label>{t('cv.photo')}</Label>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                {t('cv.photo_create_hint')}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                  id="cv-create-photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const data = String(reader.result ?? '')
                      if (data) setPhotoUrl(data)
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
                    document.getElementById('cv-create-photo-upload')?.click()
                  }
                >
                  {t('cv.photo_pick')}
                </Button>
                {photoUrl ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs text-red-600 dark:text-red-400"
                      onClick={() => setPhotoUrl('')}
                    >
                      {t('cv.photo_clear')}
                    </Button>
                    <img
                      src={photoUrl}
                      alt=""
                      className="h-16 w-16 rounded-xl border border-slate-200 object-cover dark:border-slate-600"
                    />
                  </>
                ) : null}
              </div>
            </div>

            <TabsContent value="manual" className="mt-5 space-y-4">
              <div>
                <Label>{t('cv.job_description')}</Label>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {t('cv.job_description_ph')}
                </p>
                <Textarea
                  className="mt-1 min-h-[72px] rounded-xl border-slate-200 dark:border-slate-700"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>{t('cv.manual_name')}</Label>
                  <Input
                    className="mt-1 rounded-xl"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>{t('cv.manual_headline')}</Label>
                  <Input
                    className="mt-1 rounded-xl"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>{t('cv.manual_summary')}</Label>
                <Textarea
                  className="mt-1 min-h-[100px] rounded-xl"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Email</Label>
                  <Input
                    className="mt-1 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    className="mt-1 rounded-xl"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Ville</Label>
                  <Input
                    className="mt-1 rounded-xl"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>{t('cv.manual_skills')}</Label>
                <Textarea
                  className="mt-1 min-h-[72px] rounded-xl"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                />
              </div>
              <div>
                <Label>{t('cv.manual_interests')}</Label>
                <Textarea
                  className="mt-1 min-h-[64px] rounded-xl"
                  placeholder={
                    locale === 'fr'
                      ? 'Ex. : Bénévolat, sport, lecture…'
                      : 'e.g. Volunteering, sports…'
                  }
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>{t('cv.manual_exp')}</Label>
                {expRows.map((row, i) => (
                  <div
                    key={i}
                    className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <div className="grid gap-2 sm:grid-cols-3">
                      <Input
                        placeholder="Rôle"
                        className="rounded-xl"
                        value={row.role}
                        onChange={(e) => updateExp(i, { role: e.target.value })}
                      />
                      <Input
                        placeholder="Entreprise"
                        className="rounded-xl"
                        value={row.company}
                        onChange={(e) => updateExp(i, { company: e.target.value })}
                      />
                      <Input
                        placeholder="2022 — 2024"
                        className="rounded-xl"
                        value={row.period}
                        onChange={(e) => updateExp(i, { period: e.target.value })}
                      />
                    </div>
                    <Textarea
                      placeholder="Puces (une ligne = une puce)"
                      className="rounded-xl"
                      value={row.bullets}
                      onChange={(e) => updateExp(i, { bullets: e.target.value })}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() =>
                    setExpRows((r) => [
                      ...r,
                      { role: '', company: '', period: '', bullets: '' },
                    ])
                  }
                >
                  + Expérience
                </Button>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <Input
                  placeholder="Diplôme"
                  className="rounded-xl"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
                <Input
                  placeholder="École"
                  className="rounded-xl"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
                <Input
                  placeholder="Année"
                  className="rounded-xl"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="prompt" className="mt-5 space-y-4">
              <div>
                <Label>{t('cv.job_description')}</Label>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {t('cv.job_description_ph')}
                </p>
                <Textarea
                  className="mt-1 min-h-[72px] rounded-xl border-slate-200 dark:border-slate-700"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder={t('cv.job_description_ph')}
                />
              </div>
              <div>
                <Label>{t('cv.prompt_label')}</Label>
                <Textarea
                  className="mt-1 min-h-[120px] rounded-xl border-slate-200"
                  placeholder={t('cv.prompt_ph')}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-500">
                {locale === 'fr'
                  ? 'Astuce : vous pouvez aussi remplir le formulaire (onglet à gauche) pour enrichir l’invite (mode hybride).'
                  : 'Tip: add details in the Form tab (left) to enrich the prompt (hybrid mode).'}
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-8 space-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
            <Label className="text-slate-800 dark:text-slate-200">{t('cv.templates')}</Label>
            <CvTemplatePicker value={templateSlug} onChange={setTemplateSlug} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('cv.locale')}</Label>
              <Select
                value={contentLocale}
                onValueChange={(v) => setContentLocale(v as 'fr' | 'en')}
              >
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('cv.font')}</Label>
              <Select
                value={fontFamily}
                onValueChange={(v) => setFontFamily(v as CvFontFamily)}
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
                value={layoutDensity}
                onValueChange={(v) => setLayoutDensity(v as CvLayoutDensity)}
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
                className="mt-1 h-10 w-full cursor-pointer rounded-xl border-slate-200"
                value={accentHex}
                onChange={(e) => setAccentHex(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <Button
            className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
            disabled={
              !canSubmit || generateMutation.isPending || allowed === false
            }
            onClick={() => generateMutation.mutate()}
          >
            {generateMutation.isPending ? t('cv.generating') : t('cv.generate')}
          </Button>
        </Card>
      </div>
    </div>
  )
}
