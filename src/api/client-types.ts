export type PresentationStatus = 'generating' | 'completed' | 'failed'

export type PresentationAudience = 'students' | 'professionals' | 'executives'

export type PresentationType = 'educational' | 'persuasive' | 'informative'

export type TemplateCategory =
  | 'business'
  | 'education'
  | 'creative'
  | 'tech'
  | 'marketing'

export type TemplatePlanTier = 'starter' | 'pro' | 'team'

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
  presentation_type: PresentationType
  template: string
  slide_count: number
  slides_json: string
  file_url?: string
  status: PresentationStatus
  options?: string
}
