export function formatCoverLetterSections(args: {
  raw: string
  fullName: string
  locale: 'fr' | 'en'
}): {
  greeting: string
  bodyParagraphs: string[]
  closing: string
  signature: string
} {
  const paragraphs = args.raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const fallbackGreeting = args.locale === 'fr' ? 'Madame, Monsieur,' : 'Dear Hiring Manager,'
  const fallbackClosing = args.locale === 'fr' ? 'Cordialement,' : 'Sincerely,'
  const signature = args.fullName.trim() || (args.locale === 'fr' ? 'Prénom Nom' : 'First Last Name')

  if (!paragraphs.length) {
    return {
      greeting: fallbackGreeting,
      bodyParagraphs: [
        args.locale === 'fr'
          ? 'Je vous adresse ma candidature et reste à votre disposition pour un entretien.'
          : 'I am writing to submit my application and remain available for an interview.',
      ],
      closing: fallbackClosing,
      signature,
    }
  }

  const greetingRegex =
    args.locale === 'fr'
      ? /^(madame|monsieur|madame,\s*monsieur|madame,\s*monsieur,|bonjour)/i
      : /^(dear|hello|to whom it may concern)/i

  const greeting = greetingRegex.test(paragraphs[0]) ? paragraphs.shift() ?? fallbackGreeting : fallbackGreeting

  const closingRegex =
    args.locale === 'fr'
      ? /(cordialement|salutations|agréer|bien à vous)$/i
      : /(sincerely|kind regards|best regards|yours faithfully|yours sincerely)$/i

  while (paragraphs.length) {
    const last = paragraphs[paragraphs.length - 1]
    if (closingRegex.test(last) || last.replace(/[.,]/g, '').trim() === signature) {
      paragraphs.pop()
      continue
    }
    break
  }

  return {
    greeting,
    bodyParagraphs: paragraphs.length ? paragraphs : [
      args.locale === 'fr'
        ? 'Je serais ravi(e) d’échanger sur la manière dont mon profil peut répondre à vos besoins.'
        : 'I would welcome the opportunity to discuss how my profile can support your needs.',
    ],
    closing: fallbackClosing,
    signature,
  }
}
