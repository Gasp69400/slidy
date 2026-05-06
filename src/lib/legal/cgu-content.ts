import type { SiteLocale } from '@/lib/site-messages'

export type CguSection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
  /** Deuxième bloc (ex. « En conséquence ») après les premières puces */
  tailParagraphs?: string[]
  tailBullets?: string[]
}

const FR: CguSection[] = [
  {
    title: 'Objet',
    paragraphs: [
      'Les présentes Conditions Générales d’Utilisation (CGU) régissent l’accès et l’utilisation du service Slidy, plateforme permettant la génération de contenus (présentations, CV, lettres de motivation, etc.) à l’aide de technologies d’intelligence artificielle.',
    ],
  },
  {
    title: 'Nature du service',
    paragraphs: [
      'Slidy propose un service basé sur des modèles d’intelligence artificielle.',
      'L’utilisateur reconnaît expressément que :',
    ],
    bullets: [
      'les contenus générés sont produits automatiquement par des systèmes d’intelligence artificielle ;',
      'ces contenus peuvent contenir des erreurs, approximations ou formulations inadaptées ;',
      'Slidy ne garantit en aucun cas l’exactitude, la pertinence ou l’exhaustivité des contenus générés.',
    ],
  },
  {
    title: 'Absence de garantie',
    paragraphs: [
      'Slidy ne fournit aucune garantie, expresse ou implicite, concernant :',
    ],
    bullets: [
      'la qualité des documents générés ;',
      'leur adéquation à un usage professionnel ou personnel ;',
      'leur conformité aux attentes des recruteurs ou des entreprises ;',
      'leur efficacité dans un processus de recrutement.',
    ],
  },
  {
    title: 'Détection de contenu IA (ATS, détecteurs, recruteurs)',
    paragraphs: ['L’utilisateur est informé que :'],
    bullets: [
      'les contenus générés peuvent être identifiés comme étant issus d’une intelligence artificielle ;',
      'les systèmes de détection (ATS, outils anti-IA, recruteurs) évoluent constamment.',
    ],
    tailParagraphs: [
      'En conséquence : Slidy ne garantit en aucun cas qu’un CV, une lettre de motivation ou tout autre contenu généré ne sera pas détecté comme étant issu d’une intelligence artificielle.',
      'Slidy décline toute responsabilité en cas de :',
    ],
    tailBullets: [
      'détection par un outil anti-IA ;',
      'rejet de candidature ;',
      'refus par un recruteur ;',
      'conséquences liées à l’utilisation des contenus générés.',
    ],
  },
  {
    title: 'Responsabilité de l’utilisateur',
    paragraphs: ['L’utilisateur est seul responsable :'],
    bullets: [
      'de l’utilisation des contenus générés ;',
      'de la vérification, modification et validation des documents avant usage ;',
      'des conséquences liées à leur diffusion.',
    ],
    tailParagraphs: ['Il lui appartient de :'],
    tailBullets: [
      'relire les contenus ;',
      'les adapter à sa situation réelle ;',
      'vérifier leur conformité.',
    ],
  },
  {
    title: 'Limitation de responsabilité',
    paragraphs: ['En aucun cas Slidy ne pourra être tenu responsable de :'],
    bullets: [
      'pertes d’opportunités professionnelles ;',
      'refus de candidature ;',
      'dommages directs ou indirects ;',
      'décisions prises sur la base des contenus générés.',
    ],
    tailParagraphs: [
      'L’utilisation du service se fait aux risques et périls de l’utilisateur.',
    ],
  },
  {
    title: 'Disponibilité du service',
    paragraphs: [
      'Slidy ne garantit pas un accès continu ou sans interruption au service.',
      'Le service peut être modifié, suspendu ou interrompu à tout moment, sans préavis.',
    ],
  },
  {
    title: 'Évolution des conditions',
    paragraphs: [
      'Slidy se réserve le droit de modifier les présentes CGU à tout moment.',
    ],
  },
  {
    title: 'Acceptation',
    paragraphs: ['En utilisant Slidy, l’utilisateur reconnaît :'],
    bullets: [
      'avoir lu les présentes conditions ;',
      'les accepter sans réserve.',
    ],
  },
]

const EN: CguSection[] = [
  {
    title: 'Purpose',
    paragraphs: [
      'These Terms of Use (“Terms”) govern access to and use of Slidy, a platform for generating content (presentations, CVs, cover letters, etc.) using artificial intelligence technologies.',
    ],
  },
  {
    title: 'Nature of the service',
    paragraphs: [
      'Slidy provides a service based on artificial intelligence models.',
      'The user expressly acknowledges that:',
    ],
    bullets: [
      'generated content is produced automatically by AI systems;',
      'such content may contain errors, approximations, or unsuitable wording;',
      'Slidy does not guarantee the accuracy, relevance, or completeness of generated content.',
    ],
  },
  {
    title: 'No warranty',
    paragraphs: ['Slidy makes no express or implied warranty regarding:'],
    bullets: [
      'the quality of generated documents;',
      'their fitness for professional or personal use;',
      'their alignment with recruiters’ or employers’ expectations;',
      'their effectiveness in a recruitment process.',
    ],
  },
  {
    title: 'AI content detection (ATS, detectors, recruiters)',
    paragraphs: ['The user is informed that:'],
    bullets: [
      'generated content may be identified as AI-produced;',
      'detection systems (ATS, anti-AI tools, recruiters) change constantly.',
    ],
    tailParagraphs: [
      'Accordingly, Slidy does not guarantee that a CV, cover letter, or any other generated content will not be flagged as AI-generated.',
      'Slidy disclaims all liability in the event of:',
    ],
    tailBullets: [
      'detection by an anti-AI tool;',
      'application rejection;',
      'refusal by a recruiter;',
      'consequences arising from use of generated content.',
    ],
  },
  {
    title: 'User responsibility',
    paragraphs: ['The user alone is responsible for:'],
    bullets: [
      'use of generated content;',
      'checking, editing, and validating documents before use;',
      'consequences of sharing or publishing them.',
    ],
    tailParagraphs: ['The user must:'],
    tailBullets: [
      'review the content;',
      'adapt it to their actual situation;',
      'verify compliance where applicable.',
    ],
  },
  {
    title: 'Limitation of liability',
    paragraphs: ['In no event shall Slidy be liable for:'],
    bullets: [
      'loss of professional opportunities;',
      'job application rejection;',
      'direct or indirect damages;',
      'decisions made based on generated content.',
    ],
    tailParagraphs: ['Use of the service is at the user’s sole risk.'],
  },
  {
    title: 'Service availability',
    paragraphs: [
      'Slidy does not guarantee continuous or uninterrupted access.',
      'The service may be modified, suspended, or discontinued at any time without notice.',
    ],
  },
  {
    title: 'Changes to these Terms',
    paragraphs: ['Slidy may update these Terms at any time.'],
  },
  {
    title: 'Acceptance',
    paragraphs: ['By using Slidy, the user acknowledges that they:'],
    bullets: ['have read these Terms;', 'accept them without reservation.'],
  },
]

export function getCguSections(locale: SiteLocale): CguSection[] {
  return locale === 'en' ? EN : FR
}