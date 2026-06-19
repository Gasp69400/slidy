'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'

import { CvTemplatePicker } from '@/components/cv/CvTemplatePicker'
import {
  StudioField,
  StudioHeader,
  StudioPanel,
  StudioMobileActionBar,
  StudioShell,
  studioInputClass,
  studioSelectTriggerClass,
} from '@/components/studio/studio-ui'
import { Button } from '@/components/ui/button'
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
import {
  randomAtsBadgePercent,
  writeCvPostGenerateAtsBadge,
} from '@/lib/cv-post-generate-ats-badge'
import {
  buildFinancePrompt,
  hasMinFinanceInput,
  type FinanceCvInput,
} from '@/lib/cv-finance-input'
import { useSiteLocale } from '@/lib/site-locale'

type ExpRow = { role: string; company: string; period: string; bullets: string }

/** Pourcentages décoratifs pendant la génération (pas un score ATS mesuré). */
const ATS_FAKE_STEPS = [52, 61, 70, 76, 80, 86, 91, 94] as const

type InputMode = 'prompt' | 'manual' | 'finance'

export default function CvStudioPage() {
  const { t, locale } = useSiteLocale()
  const router = useRouter()
  const [inputMode, setInputMode] = useState<InputMode>('manual')
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
  const [financeTargetRole, setFinanceTargetRole] = useState('')
  const [financeFullName, setFinanceFullName] = useState('')
  const [financeContactLine, setFinanceContactLine] = useState('')
  const [financeEducation, setFinanceEducation] = useState('')
  const [financeExperience, setFinanceExperience] = useState('')
  const [financeSkills, setFinanceSkills] = useState('')
  const [financeCertifications, setFinanceCertifications] = useState('')
  const [financeOffer, setFinanceOffer] = useState('')
  const [error, setError] = useState('')
  const [fakeAtsPercent, setFakeAtsPercent] = useState(0)
  const atsTickRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  const financeFields: FinanceCvInput = useMemo(
    () => ({
      targetRole: financeTargetRole,
      fullName: financeFullName,
      contactLine: financeContactLine,
      education: financeEducation,
      experience: financeExperience,
      skills: financeSkills,
      certifications: financeCertifications,
    }),
    [
      financeCertifications,
      financeContactLine,
      financeEducation,
      financeExperience,
      financeFullName,
      financeSkills,
      financeTargetRole,
    ],
  )

  const financePrompt = useMemo(
    () => buildFinancePrompt(financeFields, contentLocale),
    [contentLocale, financeFields],
  )

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

      const isFinance = inputMode === 'finance'
      const effectiveMode: 'prompt' | 'manual' = isFinance ? 'prompt' : inputMode
      const promptText = isFinance ? financePrompt : userPrompt

      const body = {
        mode: effectiveMode,
        sector: isFinance ? 'finance' : 'general',
        userPrompt:
          effectiveMode === 'prompt' && promptText.trim()
            ? promptText
            : undefined,
        manual:
          isFinance ?
            {
              fullName: financeFullName.trim() || undefined,
              headline: financeTargetRole.trim() || undefined,
              photoUrl: photoUrl.trim() || undefined,
            }
          : effectiveMode === 'manual' || hasManualExtra
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
        jobDescription:
          (isFinance ? financeOffer : jobDescription).trim() || undefined,
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
      try {
        writeCvPostGenerateAtsBadge(randomAtsBadgePercent())
      } catch {
        /* ignore */
      }
      router.push(`/studio/cv/${data.data.documentId}`)
    },
    onError: (e: unknown) => {
      setError(e instanceof Error ? e.message : 'Error')
    },
  })

  useEffect(() => {
    if (!generateMutation.isPending) {
      setFakeAtsPercent(0)
      if (atsTickRef.current) {
        clearInterval(atsTickRef.current)
        atsTickRef.current = null
      }
      return
    }

    let step = 0
    setFakeAtsPercent(ATS_FAKE_STEPS[0])
    atsTickRef.current = setInterval(() => {
      step += 1
      if (step >= ATS_FAKE_STEPS.length) {
        if (atsTickRef.current) {
          clearInterval(atsTickRef.current)
          atsTickRef.current = null
        }
        return
      }
      setFakeAtsPercent(ATS_FAKE_STEPS[step])
    }, 480)

    return () => {
      if (atsTickRef.current) {
        clearInterval(atsTickRef.current)
        atsTickRef.current = null
      }
    }
  }, [generateMutation.isPending])

  const canSubmit = useMemo(() => {
    if (inputMode === 'prompt') return userPrompt.trim().length >= 12
    if (inputMode === 'finance') return hasMinFinanceInput(financeFields)
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
    financeFields,
  ])

  const updateExp = (i: number, patch: Partial<ExpRow>) => {
    setExpRows((rows) =>
      rows.map((r, j) => (j === i ? { ...r, ...patch } : r)),
    )
  }

  if (capsData && allowed === false) {
    return (
      <StudioShell>
        <StudioPanel className="mx-auto max-w-lg text-center">
          <p className="text-sm text-slate-700 dark:text-slate-300">{t('cv.upgrade')}</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href="/pricing">{t('cv.pricing')}</Link>
          </Button>
        </StudioPanel>
      </StudioShell>
    )
  }

  return (
    <StudioShell>
      <StudioHeader
        icon={Sparkles}
        badge={t('studio.badge')}
        title={t('cv.page_title')}
        subtitle={t('cv.page_sub')}
      />

      <div className="flex flex-col gap-5 sm:gap-6 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
        <StudioPanel
          step={2}
          mobileStep={1}
          title={t('cv.templates')}
          className="order-1 xl:order-none xl:col-start-2 xl:row-start-1"
        >
          <CvTemplatePicker value={templateSlug} onChange={setTemplateSlug} />
        </StudioPanel>

        <StudioPanel
          step={1}
          mobileStep={2}
          title={t('cv.section_content')}
          description={t('cv.page_sub')}
          className="order-2 xl:order-none xl:col-start-1 xl:row-start-1 xl:row-span-3"
        >
          <Tabs
            value={inputMode}
            onValueChange={(v) => {
              const mode = v as InputMode
              setInputMode(mode)
              if (mode === 'finance') {
                setTemplateSlug('finance')
                setAccentHex('#1e3a5f')
                setFontFamily('georgia')
              }
            }}
          >
            <TabsList className="grid h-auto w-full max-w-xl grid-cols-3 gap-0.5 rounded-xl bg-slate-100/90 p-1 dark:bg-slate-800/80">
              <TabsTrigger value="manual" className="rounded-lg px-1 py-2 text-[11px] sm:px-3 sm:text-sm">
                {t('cv.tab_manual')}
              </TabsTrigger>
              <TabsTrigger value="prompt" className="rounded-lg px-1 py-2 text-[11px] sm:px-3 sm:text-sm">
                {t('cv.tab_prompt')}
              </TabsTrigger>
              <TabsTrigger value="finance" className="rounded-lg px-1 py-2 text-[11px] sm:px-3 sm:text-sm">
                {t('cv.tab_finance')}
              </TabsTrigger>
            </TabsList>

            <div className="mt-5 rounded-2xl border border-slate-100/90 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
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

            <TabsContent value="finance" className="mt-5 space-y-5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('cv.finance_intro')}
              </p>

              <div>
                <Label htmlFor="finance-role">{t('cv.finance.role')}</Label>
                <Input
                  id="finance-role"
                  className="mt-1 rounded-xl"
                  placeholder={t('cv.finance.role_ph')}
                  value={financeTargetRole}
                  onChange={(e) => setFinanceTargetRole(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="finance-name">{t('cv.finance.name')}</Label>
                  <Input
                    id="finance-name"
                    className="mt-1 rounded-xl"
                    value={financeFullName}
                    onChange={(e) => setFinanceFullName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="finance-contact">{t('cv.finance.contact')}</Label>
                  <Input
                    id="finance-contact"
                    className="mt-1 rounded-xl"
                    placeholder={t('cv.finance.contact_ph')}
                    value={financeContactLine}
                    onChange={(e) => setFinanceContactLine(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="finance-education">{t('cv.finance.education')}</Label>
                <Textarea
                  id="finance-education"
                  className="mt-1 min-h-[72px] rounded-xl border-slate-200 text-sm leading-relaxed"
                  placeholder={t('cv.finance.education_ph')}
                  value={financeEducation}
                  onChange={(e) => setFinanceEducation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="finance-experience">{t('cv.finance.experience')}</Label>
                <Textarea
                  id="finance-experience"
                  className="mt-1 min-h-[120px] rounded-xl border-slate-200 text-sm leading-relaxed"
                  placeholder={t('cv.finance.experience_ph')}
                  value={financeExperience}
                  onChange={(e) => setFinanceExperience(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="finance-skills">{t('cv.finance.skills')}</Label>
                <Textarea
                  id="finance-skills"
                  className="mt-1 min-h-[64px] rounded-xl border-slate-200 text-sm leading-relaxed"
                  placeholder={t('cv.finance.skills_ph')}
                  value={financeSkills}
                  onChange={(e) => setFinanceSkills(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="finance-certs">{t('cv.finance.certifications')}</Label>
                <Textarea
                  id="finance-certs"
                  className="mt-1 min-h-[56px] rounded-xl border-slate-200 text-sm leading-relaxed"
                  placeholder={t('cv.finance.certifications_ph')}
                  value={financeCertifications}
                  onChange={(e) => setFinanceCertifications(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="finance-offer">{t('cv.finance.offer')}</Label>
                <Textarea
                  id="finance-offer"
                  className="mt-1 min-h-[72px] rounded-xl border-slate-200 text-sm leading-relaxed dark:border-slate-700"
                  placeholder={t('cv.finance.offer_ph')}
                  value={financeOffer}
                  onChange={(e) => setFinanceOffer(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </StudioPanel>

        <div className="z-0 order-3 flex flex-col gap-5 sm:gap-6 xl:col-start-2 xl:row-start-2 xl:sticky xl:top-20 xl:self-start">
          <StudioPanel step={3} title={t('cv.section_appearance')}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StudioField label={t('cv.locale')}>
                <Select
                  value={contentLocale}
                  onValueChange={(v) => setContentLocale(v as 'fr' | 'en')}
                >
                  <SelectTrigger className={studioSelectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </StudioField>
              <StudioField label={t('cv.font')}>
                <Select
                  value={fontFamily}
                  onValueChange={(v) => setFontFamily(v as CvFontFamily)}
                >
                  <SelectTrigger className={studioSelectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">{t('cv.font.inter')}</SelectItem>
                    <SelectItem value="georgia">{t('cv.font.georgia')}</SelectItem>
                    <SelectItem value="source">{t('cv.font.source')}</SelectItem>
                  </SelectContent>
                </Select>
              </StudioField>
              <StudioField label={t('cv.layout')}>
                <Select
                  value={layoutDensity}
                  onValueChange={(v) => setLayoutDensity(v as CvLayoutDensity)}
                >
                  <SelectTrigger className={studioSelectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">{t('cv.layout.compact')}</SelectItem>
                    <SelectItem value="normal">{t('cv.layout.normal')}</SelectItem>
                    <SelectItem value="spacious">{t('cv.layout.spacious')}</SelectItem>
                  </SelectContent>
                </Select>
              </StudioField>
              <StudioField label={t('cv.accent')} className="col-span-2">
                <Input
                  type="color"
                  className="h-10 w-full cursor-pointer rounded-xl border-slate-200"
                  value={accentHex}
                  onChange={(e) => setAccentHex(e.target.value)}
                />
              </StudioField>
            </div>
          </StudioPanel>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          ) : null}

          {generateMutation.isPending && (
            <div
              className="rounded-2xl border border-emerald-200/80 bg-emerald-50/95 p-4 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/50"
              role="status"
              aria-live="polite"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                {t('cv.ats_meter_title')}
              </p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {fakeAtsPercent}
                <span className="text-2xl font-semibold">%</span>
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-[width] duration-500 ease-out dark:from-emerald-400 dark:to-emerald-500"
                  style={{ width: `${Math.min(fakeAtsPercent, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] leading-snug text-emerald-800/85 dark:text-emerald-200/75">
                {t('cv.ats_meter_sub')}
              </p>
            </div>
          )}

          <Button
            className="hidden h-12 w-full rounded-xl bg-brand-500 shadow-lg shadow-brand-500/25 hover:bg-brand-600 xl:flex"
            disabled={
              !canSubmit || generateMutation.isPending || allowed === false
            }
            onClick={() => generateMutation.mutate()}
          >
            {generateMutation.isPending ? t('cv.generating') : t('cv.generate')}
          </Button>
        </div>
      </div>

      <StudioMobileActionBar hideFrom="xl">
        <Button
          className="h-12 w-full rounded-xl bg-brand-500 shadow-lg shadow-brand-500/25 hover:bg-brand-600"
          disabled={
            !canSubmit || generateMutation.isPending || allowed === false
          }
          onClick={() => generateMutation.mutate()}
        >
          {generateMutation.isPending ? t('cv.generating') : t('cv.generate')}
        </Button>
      </StudioMobileActionBar>
    </StudioShell>
  )
}
