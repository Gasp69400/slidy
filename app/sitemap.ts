import type { MetadataRoute } from 'next'

import { SITE_BASE_URL } from '@/lib/site-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: SITE_BASE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_BASE_URL}/pricing`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_BASE_URL}/studio/cv`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_BASE_URL}/legal/cgu`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_BASE_URL}/templates`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]
}
