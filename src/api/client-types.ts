export type PresentationStatus = 'generating' | 'completed' | 'failed'

export type PresentationAudience =
  | 'students'
  | 'professors'
  | 'professionals'
  | 'executives'

export type PresentationType = 'educational' | 'persuasive' | 'informative'

export type TemplateCategory =
  | 'business'
  | 'education'
  | 'creative'
  | 'tech'
  | 'marketing'
  | 'nature'
  | 'luxury'

  export type TemplatePlanTier = 'starter' | 'pro' | 'ultimate'

export interface Template {
  id: string
  name: string
  slug: string
  description?: string
  category?: TemplateCategory
  plan_tier: TemplatePlanTier
  color_primary?: string
  color_secondary?: string
  color_accent?: string
  color_bg?: string
  color_text?: string
  font_heading?: string
  font_body?: string
  preview_image?: string
  is_featured?: boolean
}

export interface Presentation {
  id: string
  title: string
  topic: string
  audience: PresentationAudience
  presentationType: PresentationType
  templateSlug: string
  slideCount: number
  slidesJson: string
  fileUrl?: string
  isPublic: boolean
  status: PresentationStatus
  options?: string
}