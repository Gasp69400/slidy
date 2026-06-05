export type SiteLocale = 'fr' | 'en'

export const SITE_STRINGS = {
  'lang.switch_en': { fr: 'English', en: 'English' },
  'lang.switch_fr': { fr: 'Français', en: 'Français' },

  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.create': { fr: 'Créer une présentation', en: 'Create presentation' },
  'nav.studio': { fr: 'Studio', en: 'Studio' },
  'nav.cv': { fr: 'CV & lettre', en: 'CV & cover letter' },
  'nav.presentations': { fr: 'Mes présentations', en: 'My presentations' },
  'presentations.view': { fr: 'Voir', en: 'View' },
  'presentations.delete': { fr: 'Supprimer', en: 'Delete' },
  'presentations.delete_confirm': {
    fr: 'Supprimer cette présentation ?',
    en: 'Delete this presentation?',
  },
  'presentations.delete_error': {
    fr: 'Impossible de supprimer la présentation.',
    en: 'Could not delete the presentation.',
  },
  'nav.templates': { fr: 'Templates', en: 'Templates' },
  'templates.page_title': {
    fr: 'Modèles de présentation',
    en: 'Presentation templates',
  },
  'templates.page_sub': {
    fr: 'Tous les styles disponibles pour vos slides — aperçu visuel et ouverture directe dans l’outil de création.',
    en: 'Every available slide style — visual preview and jump straight into the creator.',
  },
  'templates.use': { fr: 'Utiliser', en: 'Use template' },
  'templates.empty_api': {
    fr: 'Modèles catalogue Slidy (la bibliothèque serveur peut s’enrichir selon votre offre).',
    en: 'Slidy catalog templates (server library may grow with your plan).',
  },
  'templates.cat.all': { fr: 'Tous', en: 'All' },
  'templates.cat.business': { fr: 'Business', en: 'Business' },
  'templates.cat.creative': { fr: 'Créatif', en: 'Creative' },
  'templates.cat.tech': { fr: 'Tech', en: 'Tech' },
  'templates.cat.education': { fr: 'Éducation', en: 'Education' },
  'templates.cat.marketing': { fr: 'Marketing', en: 'Marketing' },
  'nav.menu_cv': { fr: 'CV', en: 'CV' },
  'nav.menu_cover_letter': {
    fr: 'Lettre de motivation',
    en: 'Cover Letter',
  },
  'coverLetter.placeholder.title': {
    fr: 'Lettre de motivation',
    en: 'Cover letter',
  },
  'coverLetter.placeholder.sub': {
    fr: 'Cette section accueillera bientôt un assistant dédié uniquement à la lettre (ton, structure, ciblage). En attendant, le studio CV génère déjà CV + lettre.',
    en: 'This area will soon host a dedicated letter assistant (tone, structure, targeting). For now, the CV studio already generates both CV and letter.',
  },
  'coverLetter.placeholder.cta': { fr: 'Ouvrir le studio CV', en: 'Open CV studio' },
  'nav.tagline': {
    fr: 'Créez des présentations claires, vite.',
    en: 'Create clear presentations, fast.',
  },

  'landing.pricing': { fr: 'Plans', en: 'Plans' },
  'landing.login': { fr: 'Connexion / Inscription', en: 'Log in / Sign up' },
  'landing.start': { fr: 'Commencer gratuitement', en: 'Start for free' },
  'landing.menu_open': { fr: 'Ouvrir le menu', en: 'Open menu' },
  'landing.menu_close': { fr: 'Fermer le menu', en: 'Close menu' },
  'landing.menu_trigger': { fr: 'Menu', en: 'Menu' },
  'landing.menu_account': { fr: 'Mon abonnement', en: 'My subscription' },
  'landing.menu_theme': { fr: 'Apparence', en: 'Appearance' },
  'landing.theme_light': { fr: 'Clair', en: 'Light' },
  'landing.theme_dark': { fr: 'Sombre', en: 'Dark' },
  'landing.theme_system': { fr: 'Système', en: 'System' },

  'account.title': { fr: 'Mon abonnement', en: 'My subscription' },
  'account.subtitle': {
    fr: 'État de votre offre Slidy et facturation.',
    en: 'Your Slidy plan and billing status.',
  },
  'account.email': { fr: 'E-mail', en: 'Email' },
  'account.status_label': { fr: 'Statut d’abonnement', en: 'Subscription status' },
  'account.status.TRIAL': { fr: 'Essai', en: 'Trial' },
  'account.status.ACTIVE': { fr: 'Actif', en: 'Active' },
  'account.status.PAST_DUE': { fr: 'Paiement en retard', en: 'Past due' },
  'account.status.CANCELED': { fr: 'Annulé', en: 'Canceled' },
  'account.status.UNPAID': { fr: 'Impayé', en: 'Unpaid' },
  'account.status.UNKNOWN': { fr: 'Non renseigné', en: 'Unknown' },
  'account.login_cta': { fr: 'Se connecter', en: 'Sign in' },
  'account.login_hint': {
    fr: 'Connectez-vous pour voir votre abonnement.',
    en: 'Sign in to view your subscription.',
  },
  'account.err_load': {
    fr: 'Impossible de charger votre profil.',
    en: 'Could not load your profile.',
  },
  'account.err_load_detail': {
    fr: 'Impossible de charger votre profil. Détail : {detail}',
    en: 'Could not load your profile. Details: {detail}',
  },
  'account.db_unavailable': {
    fr: 'Connexion base de données indisponible — affichage limité (plan Starter par défaut). Mettez à jour SUPABASE_DATABASE_URL sur Vercel avec le mot de passe actuel de Supabase.',
    en: 'Database connection unavailable — limited view (default Starter plan). Update SUPABASE_DATABASE_URL on Vercel with your current Supabase database password.',
  },
  'account.back_home': { fr: 'Retour à l’accueil', en: 'Back to home' },
  'account.plan_label': { fr: 'Plan actuel', en: 'Current plan' },
  'account.plan.STARTER': { fr: 'Starter', en: 'Starter' },
  'account.plan_starter_hint': {
    fr: 'Plan gratuit — idéal pour découvrir Slidy.',
    en: 'Free plan — great to get started with Slidy.',
  },
  'account.plan.PRO': { fr: 'Pro', en: 'Pro' },
  'account.plan.ULTIMATE': { fr: 'Ultimate', en: 'Ultimate' },
  'account.cancel_cta': {
    fr: 'Résilier mon abonnement',
    en: 'Cancel my subscription',
  },
  'account.cancel_pending': {
    fr: 'Résiliation programmée — accès maintenu jusqu’au {date}.',
    en: 'Cancellation scheduled — access until {date}.',
  },
  'account.upgrade_cta': {
    fr: 'Passer au plan supérieur',
    en: 'Upgrade your plan',
  },
  'account.cancel.title': {
    fr: 'Résilier mon abonnement',
    en: 'Cancel my subscription',
  },
  'account.cancel.subtitle': {
    fr: 'Vous conservez l’accès à votre plan jusqu’à la fin de la période en cours.',
    en: 'You keep access to your plan until the end of the current billing period.',
  },
  'account.cancel.plan_label': { fr: 'Plan concerné', en: 'Plan' },
  'account.cancel.body': {
    fr: 'La résiliation prend effet à la fin de votre période de facturation. Vous ne serez plus débité ensuite et repasserez sur le plan Starter.',
    en: 'Cancellation takes effect at the end of your billing period. You will not be charged again and will return to the Starter plan.',
  },
  'account.cancel.confirm': {
    fr: 'Confirmer la résiliation',
    en: 'Confirm cancellation',
  },
  'account.cancel.back': {
    fr: 'Retour à mon abonnement',
    en: 'Back to my subscription',
  },
  'account.cancel.success': {
    fr: 'Votre résiliation est enregistrée. Accès maintenu jusqu’au {date}.',
    en: 'Your cancellation is scheduled. Access until {date}.',
  },
  'account.cancel.already': {
    fr: 'Une résiliation est déjà programmée pour le {date}.',
    en: 'A cancellation is already scheduled for {date}.',
  },
  'account.cancel.err': {
    fr: 'Impossible de résilier pour le moment. Détail : {detail}',
    en: 'Could not cancel right now. Details: {detail}',
  },
  'account.cancel.login_hint': {
    fr: 'Connectez-vous pour gérer votre abonnement.',
    en: 'Sign in to manage your subscription.',
  },
  'account.cancel.not_eligible': {
    fr: 'Aucun abonnement payant actif à résilier.',
    en: 'No active paid subscription to cancel.',
  },

  'home.hero.badge': {
    fr: 'Slides & CV IA · même studio Slidy',
    en: 'AI slides & CVs · one Slidy studio',
  },
  'home.hero.title1': {
    fr: 'Transformez votre idée en',
    en: 'Turn your idea into a',
  },
  'home.hero.title2': { fr: 'deck soigné', en: 'polished deck' },
  'home.hero.title3': {
    fr: '— sans l’effort du design.',
    en: '— without the design grind.',
  },
  'home.hero.subtitle': {
    fr: 'Slides : décrivez votre sujet une fois — l’IA structure le récit et le détail visuel pour que vous présentiez sans y passer la nuit. CV : même principe, avec des modèles adaptés aux logiciels RH (ATS) pour vos candidatures.',
    en: 'Slides: describe your topic once — AI shapes the narrative and visual layer so you can present without pulling an all-nighter. CVs: same approach, with templates tailored to HR software (ATS) for your applications.',
  },
  'home.hero.cta_primary': { fr: 'Commencer gratuitement', en: 'Start for free' },
  'home.hero.cta_secondary': { fr: 'Connexion / Inscription', en: 'Log in / Sign up' },
  'home.hero.note': {
    fr: 'Sans carte bancaire pour essayer · Annulation à tout moment',
    en: 'No credit card required to try · Cancel anytime',
  },
  'home.hero.cta_cv': {
    fr: 'Créer un CV avec l’IA',
    en: 'Create a CV with AI',
  },
  'home.stats.docs_label': {
    fr: 'Documents déjà créés sur Slidy',
    en: 'Documents created with Slidy',
  },
  'home.stats.docs_value': {
    fr: '+ de 18 000',
    en: '18,000+',
  },
  'home.stats.docs_hint': {
    fr: 'Présentations, CV et lettres exportés par la communauté.',
    en: 'Presentations, CVs, and cover letters exported by our community.',
  },
  'home.stats.ats_label': {
    fr: 'Indicateur ATS moyen (à la génération)',
    en: 'Average ATS score (at generation)',
  },
  'home.stats.ats_value': {
    fr: '89 %',
    en: '89%',
  },
  'home.stats.ats_hint': {
    fr: '* Score indicatif communiqué après génération d’un CV, pas une mesure garantie contre un ATS réel.',
    en: '* Illustrative score shown after CV generation — not a guarantee against any real ATS.',
  },
  'home.stats.formats_label': {
    fr: 'Deux studios, un même compte',
    en: 'Two studios, one account',
  },
  'home.stats.formats_value': {
    fr: 'Présentations + CV',
    en: 'Presentations + CVs',
  },
  'home.stats.formats_sub': {
    fr: 'Decks pour convaincre en réunion · CV & lettres pour les recruteurs.',
    en: 'Decks to win the meeting · CVs and cover letters for recruiters.',
  },
  'home.stats.social_kicker': {
    fr: 'Utilisé pour',
    en: 'Used for',
  },
  'home.stats.social_use_pitch': {
    fr: 'Pitch investisseur',
    en: 'Investor pitch',
  },
  'home.stats.social_use_jobs': {
    fr: 'Candidatures',
    en: 'Job applications',
  },
  'home.stats.social_use_demo': {
    fr: 'Demo day & soutenances',
    en: 'Demo days & thesis defense',
  },
  'home.stats.testimonial_1.quote': {
    fr: '« Mon deck Series A prêt en une soirée — structure claire, rendu pro. »',
    en: '“My Series A deck ready in one evening — clear story, polished look.”',
  },
  'home.stats.testimonial_1.author': {
    fr: 'Léa M. · Fondatrice',
    en: 'Léa M. · Founder',
  },
  'home.stats.testimonial_2.quote': {
    fr: '« CV refait en 20 minutes, candidatures envoyées le lendemain. »',
    en: '“CV rebuilt in 20 minutes — applications sent the next day.”',
  },
  'home.stats.testimonial_2.author': {
    fr: 'Thomas R. · Product manager',
    en: 'Thomas R. · Product manager',
  },
  'home.preview.status': {
    fr: 'Studio · aperçu en direct',
    en: 'Studio · live preview',
  },
  'home.preview.prompt': { fr: 'Invite', en: 'Prompt' },
  'home.preview.prompt_text': {
    fr: '« Pitch deck pour une climate-tech en Series A… »',
    en: '“Pitch deck for a climate-tech startup raising Series A…”',
  },
  'home.preview.tag_outline': { fr: 'Plan', en: 'Outline' },
  'home.preview.tag_slides': { fr: 'Slides', en: 'Slides' },
  'home.preview.tag_export': { fr: 'Export', en: 'Export' },
  'home.preview.structure': {
    fr: 'Structure générée',
    en: 'Generated structure',
  },
  'home.how.title': { fr: 'Comment ça marche', en: 'How it works' },
  'home.how.subtitle': {
    fr: 'Même mécanisme pour vos slides ou votre CV — du brief à la version prête à partager.',
    en: 'The same flow for slides or CVs — from brief to a version ready to share.',
  },
  'home.how.1.title': { fr: 'Décrivez votre exposé', en: 'Describe your presentation' },
  'home.how.1.body': {
    fr: 'Ajoutez un sujet, une audience et un ton. Nous construisons le récit et le découpage en slides.',
    en: 'Add a topic, audience, and tone. We build the narrative and slide structure for you.',
  },
  'home.how.2.title': { fr: 'Affinez en quelques clics', en: 'Refine in a few clicks' },
  'home.how.2.body': {
    fr: 'Modifiez les blocs, changez les visuels, ajustez la mise en page — un éditeur calme qui vous laisse penser.',
    en: 'Edit blocks, swap visuals, adjust layout — a calm editor that lets you focus on the message.',
  },
  'home.how.3.title': { fr: 'Exportez & présentez', en: 'Export & present' },
  'home.how.3.body': {
    fr: 'Téléchargez en PDF ou PowerPoint, ou partagez un lien. Soyez impeccable sans stress de dernière minute.',
    en: 'Download as PDF or PowerPoint, or share a link. Look polished without last-minute stress.',
  },
  'home.features.title': {
    fr: 'L’essentiel, sans le superflu',
    en: 'Everything you need, nothing you don’t',
  },
  'home.features.subtitle': {
    fr: 'Présenter en réunion et postuler avec un CV lisible pour les ATS — tout est dans Slidy.',
    en: 'Present in meetings and apply with ATS-friendly CVs — all in Slidy.',
  },
  'home.features.1.title': {
    fr: 'Génération ultra rapide',
    en: 'Lightning-fast generation',
  },
  'home.features.1.desc': {
    fr: 'Du prompt à une structure de slides avant la fin de votre café.',
    en: 'From prompt to slide structure before your coffee gets cold.',
  },
  'home.features.2.title': {
    fr: 'Un rendu premium',
    en: 'Premium visual polish',
  },
  'home.features.2.desc': {
    fr: 'Typographie, espacements et micro-interactions — sans outil de design.',
    en: 'Typography, spacing, and micro-interactions — no design tool required.',
  },
  'home.features.3.title': {
    fr: 'Pensé pour le quotidien',
    en: 'Built for real workflows',
  },
  'home.features.3.desc': {
    fr: 'Exports, limites et offres alignés sur la façon dont les équipes livrent vraiment.',
    en: 'Exports, limits, and plans aligned with how teams actually deliver.',
  },
  'home.features.4.title': {
    fr: 'CV & lettre de motivation IA',
    en: 'AI CVs & cover letters',
  },
  'home.features.4.desc': {
    fr: 'Contenu assisté par l’invite, mise en page pro, optimisation affichée à la création pour rassurer sur la compatibilité lecteur.',
    en: 'Prompt-driven drafts, professional layout, and an ATS compatibility cue at generation — reassuring without overpromising.',
  },
  'home.pricing.kicker': {
    fr: 'Tarifs transparents',
    en: 'Transparent pricing',
  },
  'home.pricing.title': {
    fr: 'Choisissez l’offre qui vous ressemble',
    en: 'Pick the plan that matches your tempo',
  },
  'home.pricing.subtitle': {
    fr: 'Résumé de chaque plan : quotas, fonctionnalités clés pour les présentations et les CV avec optimisations visuelles ATS. Upgrade en un clic quand vous êtes prêt.',
    en: 'Each plan at a glance: quotas, key features for presentations and CVs with ATS-oriented cues. Upgrade in one click when you’re ready.',
  },
  'home.pricing.includes': {
    fr: 'Ce que comprend l’offre',
    en: 'What’s included',
  },
  'home.pricing.footnote': {
    fr: 'Sans engagement sur Starter · Période d’essai disponible selon les offres payantes configurées.',
    en: 'No commitment on Starter · Free trial available depending on configured paid plans.',
  },
  'home.pricing.link_full': {
    fr: 'Page tarifs détaillée et conditions →',
    en: 'Full pricing page & details →',
  },
  'home.pricing.card_cta': {
    fr: 'Voir cette offre',
    en: 'View this plan',
  },
  'home.footer.title': {
    fr: 'Prêt pour votre prochain deck ?',
    en: 'Ready for your next deck?',
  },
  'home.footer.subtitle': {
    fr: 'Rejoignez ceux qui utilisent l’IA pour mieux présenter, plus vite.',
    en: 'Join teams using AI to present better, faster.',
  },
  'home.footer.cta_primary': { fr: 'Commencer gratuitement', en: 'Start for free' },
  'home.footer.cta_secondary': { fr: 'Connexion / Inscription', en: 'Log in / Sign up' },
  'home.footer.pricing': { fr: 'Plans', en: 'Plans' },
  'home.footer.studio': { fr: 'Studio', en: 'Studio' },
  'home.footer.login': { fr: 'Connexion', en: 'Log in' },
  'home.footer.terms': {
    fr: 'Conditions d’utilisation',
    en: 'Terms of use',
  },
  'home.footer.copy': { fr: 'Tous droits réservés', en: 'All rights reserved' },

  'legal.cgu.title': {
    fr: 'Conditions générales d’utilisation',
    en: 'Terms of use',
  },
  'legal.cgu.back_home': { fr: '← Accueil', en: '← Home' },
  'legal.cgu.updated': {
    fr: 'Document d’information — Slidy. Consultez cette page régulièrement : elle peut être mise à jour.',
    en: 'Information document — Slidy. Check this page periodically; it may be updated.',
  },

  'pricing.kicker': { fr: 'Tarifs', en: 'Pricing' },
  'pricing.title': {
    fr: 'Des offres simples. Un rendu sérieux.',
    en: 'Simple plans. Serious output.',
  },
  'pricing.subtitle': {
    fr: 'Commencez gratuitement, passez à la vitesse supérieure quand vous avez besoin de plus de puissance, d’exports et de rapidité.',
    en: 'Start free, upgrade when you need more power, exports, and speed.',
  },
  'pricing.popular': { fr: 'Populaire', en: 'Popular' },
  'pricing.selected': { fr: 'Sélectionné', en: 'Selected' },
  'pricing.back': { fr: '← Retour à l’accueil', en: '← Back to home' },
  'pricing.hero_badge': {
    fr: 'Slides & CV · même studio',
    en: 'Slides & résumés · one studio',
  },
  'pricing.title_lead': {
    fr: 'Des offres simples.',
    en: 'Simple plans.',
  },
  'pricing.title_accent': {
    fr: 'Un rendu sérieux.',
    en: 'Serious output.',
  },
  'pricing.trust_slides': {
    fr: 'Présentations IA',
    en: 'AI presentations',
  },
  'pricing.trust_cv': {
    fr: 'CV & lettres ATS',
    en: 'ATS résumés & letters',
  },
  'pricing.trust_export': {
    fr: 'Export PDF & PPTX',
    en: 'PDF & PPTX export',
  },
  'pricing.secure': {
    fr: 'Paiement sécurisé via Stripe · Annulation à tout moment',
    en: 'Secure checkout via Stripe · Cancel anytime',
  },
  'pricing.checkout_error': {
    fr: 'Impossible de lancer le paiement. Détail : {detail}',
    en: 'Could not start checkout. Details: {detail}',
  },
  'pricing.checkout_login': {
    fr: 'Connectez-vous pour souscrire, puis réessayez.',
    en: 'Sign in to subscribe, then try again.',
  },
  'pricing.checkout_missing_price': {
    fr: 'Tarif Stripe non configuré pour ce plan (variables d’environnement).',
    en: 'Stripe price not configured for this plan (environment variables).',
  },
  'pricing.tier.starter.name': { fr: 'Starter', en: 'Starter' },
'pricing.tier.starter.desc': {
  fr: 'Essayez Slidy gratuitement pour vos premières créations.',
  en: 'Try Slidy for free for your first creations.',
},
'pricing.tier.starter.f1': {
  fr: '5 créations / mois',
  en: '5 creations / month',
},
'pricing.tier.starter.f2': { fr: 'Templates de base', en: 'Basic templates' },
'pricing.tier.starter.f3': {
  fr: 'Export PDF',
  en: 'PDF export',
},
'pricing.tier.starter.cta': { fr: 'Commencer gratuitement', en: 'Start for free' },
'pricing.tier.starter.period': { fr: 'pour toujours', en: 'forever' },
'pricing.tier.pro.name': { fr: 'Pro', en: 'Pro' },
'pricing.tier.pro.desc': {
  fr: 'Pour les étudiants et jeunes pros qui veulent se démarquer.',
  en: 'For students and young pros who want to stand out.',
},
'pricing.tier.pro.f1': {
  fr: '50 créations / mois',
  en: '50 creations / month',
},
'pricing.tier.pro.f2': { fr: 'CV optimisé ATS + lettre de motivation', en: 'ATS CV + cover letter' },
'pricing.tier.pro.f3': {
  fr: 'Export PDF & PPTX • Templates Pro',
  en: 'PDF & PPTX export • Pro templates',
},
'pricing.tier.pro.cta': { fr: 'Souscrire au plan Pro', en: 'Subscribe to Pro' },
'pricing.tier.pro.period': { fr: '/ mois', en: '/ month' },
'pricing.tier.ultimate.name': { fr: 'Ultimate', en: 'Ultimate' },
'pricing.tier.ultimate.desc': {
  fr: 'La solution complète pour maximiser vos chances.',
  en: 'The complete solution to maximize your chances.',
},
'pricing.tier.ultimate.f1': { fr: '200 créations / mois', en: '200 creations / month' },
'pricing.tier.ultimate.f2': {
  fr: 'Tout le Pro + tous les templates débloqués',
  en: 'Everything in Pro + all templates unlocked',
},
'pricing.tier.ultimate.f3': {
  fr: 'Export PDF, PPTX & JSON • Support prioritaire',
  en: 'PDF, PPTX & JSON export • Priority support',
},
'pricing.tier.ultimate.cta': { fr: 'Souscrire au plan Ultimate', en: 'Subscribe to Ultimate' },
'pricing.tier.ultimate.period': { fr: '/ mois', en: '/ month' },

  'studio.badge': { fr: 'Studio IA', en: 'AI Studio' },
  'studio.new_title': { fr: 'Nouveau document', en: 'New document' },
  'studio.new_sub': {
    fr: 'Décris ton idée, choisis le type, et l’IA prépare une base éditable.',
    en: 'Describe your idea, pick a type, and AI prepares an editable base.',
  },
  'studio.label_topic': { fr: 'Sujet principal', en: 'Main topic' },
  'studio.ph_topic': {
    fr: 'Ex : pitch startup sur une IA éducative',
    en: 'e.g. Startup pitch about an edtech AI',
  },
  'studio.label_title': { fr: 'Titre (optionnel)', en: 'Title (optional)' },
  'studio.ph_title': {
    fr: 'Ex : EduFlow — l’IA pour apprendre mieux',
    en: 'e.g. EduFlow — learn smarter with AI',
  },
  'studio.label_type': { fr: 'Type', en: 'Type' },
  'studio.label_detail': { fr: 'Niveau de détail', en: 'Detail' },
  'studio.detail_short': { fr: 'Court', en: 'Short' },
  'studio.detail_medium': { fr: 'Moyen', en: 'Medium' },
  'studio.detail_detailed': { fr: 'Détaillé', en: 'Detailed' },
  'studio.type.presentation': { fr: 'Présentation', en: 'Presentation' },
  'studio.type.whiteboard': { fr: 'Tableau blanc', en: 'Whiteboard' },
  'studio.type.document': { fr: 'Document', en: 'Document' },
  'studio.type.notes': { fr: 'Notes', en: 'Notes' },
  'studio.type.visual_page': { fr: 'Page visuelle', en: 'Visual page' },
  'studio.type.marketing': {
    fr: 'Deck marketing',
    en: 'Marketing deck',
  },
  'studio.type.cv_cover': { fr: 'CV & lettre', en: 'CV & cover letter' },
  'studio.cv_card_title': {
    fr: 'CV & lettre de motivation',
    en: 'CV & cover letter',
  },
  'studio.cv_card_sub': {
    fr: 'Générez un CV structuré et une lettre pro, puis exportez en PDF.',
    en: 'Generate a structured CV and pro letter, then export to PDF.',
  },
  'studio.cv_card_cta': { fr: 'Ouvrir l’outil CV', en: 'Open CV builder' },
  'studio.plan_line': {
    fr: 'Plan {plan} · {max} créations / {period}',
    en: 'Plan {plan} · {max} creations / {period}',
  },
  'studio.quota_period.day': { fr: 'jour', en: 'day' },
  'studio.quota_period.month': { fr: 'mois', en: 'month' },
  'studio.exports': { fr: 'Exports', en: 'Exports' },
  'studio.plan_blocked': {
    fr: 'Ce type de document n’est pas inclus dans ton plan actuel.',
    en: 'This document type is not included in your current plan.',
  },
  'studio.btn_generating': { fr: 'Génération...', en: 'Generating...' },
  'studio.btn_open': { fr: 'Générer et ouvrir', en: 'Generate and open' },
  'studio.docs_title': { fr: 'Mes documents', en: 'My documents' },
  'studio.docs_sub': {
    fr: 'Ouvre un document pour éditer ses blocs et exporter.',
    en: 'Open a document to edit blocks and export.',
  },
  'studio.loading': { fr: 'Chargement...', en: 'Loading...' },
  'studio.empty': {
    fr: 'Aucun document pour l’instant.',
    en: 'No documents yet.',
  },
  'studio.open': { fr: 'Ouvrir', en: 'Open' },
  'studio.blocks': { fr: 'blocs', en: 'blocks' },
  'studio.doc_delete': { fr: 'Supprimer', en: 'Delete' },
  'studio.doc_delete_confirm': {
    fr: 'Supprimer ce document ?',
    en: 'Delete this document?',
  },
  'studio.doc_delete_error': {
    fr: 'Impossible de supprimer le document.',
    en: 'Could not delete the document.',
  },
  'studio.err_generic': {
    fr: 'Une erreur est survenue',
    en: 'Something went wrong',
  },

  'editor.back': { fr: 'Retour au studio', en: 'Back to studio' },
  'editor.document': { fr: 'Document', en: 'Document' },
  'editor.add_blocks': { fr: 'Ajouter des blocs', en: 'Add blocks' },
  'editor.block.title': { fr: 'Titre', en: 'Title' },
  'editor.block.heading': { fr: 'Intertitre', en: 'Heading' },
  'editor.block.text': { fr: 'Paragraphe', en: 'Paragraph' },
  'editor.block.bullets': { fr: 'Liste', en: 'Bullets' },
  'editor.block.image': { fr: 'Image', en: 'Image' },
  'editor.upload_image': { fr: 'Importer une image', en: 'Upload image' },
  'editor.media_title': { fr: 'Médiathèque', en: 'Media library' },
  'editor.media_help': {
    fr: 'Clique pour insérer dans le bloc image sélectionné, ou crée un nouveau bloc image.',
    en: 'Click to insert into the selected image block, or create a new image block.',
  },
  'editor.loading_short': { fr: 'Chargement…', en: 'Loading…' },
  'editor.no_media': {
    fr: 'Aucun média uploadé.',
    en: 'No uploaded media yet.',
  },
  'editor.media_alt': { fr: 'Média', en: 'Media' },
  'editor.export': { fr: 'Exporter', en: 'Export' },
  'editor.export_pdf': { fr: 'Exporter PDF', en: 'Export PDF' },
  'editor.export_pptx': { fr: 'Exporter PPTX', en: 'Export PPTX' },
  'editor.locked_pptx_title': {
    fr: 'Export PowerPoint verrouillé',
    en: 'PowerPoint export locked',
  },
  'editor.locked_pptx_desc': {
    fr: 'Passe au plan supérieur pour exporter en .pptx.',
    en: 'Upgrade your plan to export as .pptx.',
  },
  'editor.block_editor': { fr: 'Éditeur de blocs', en: 'Block editor' },
  'editor.block_editor_sub': {
    fr: 'Glissez, éditez en ligne et exportez instantanément.',
    en: 'Drag, edit inline, and export instantly.',
  },
  'editor.blocks_count': { fr: '{n} blocs', en: '{n} blocks' },
  'editor.slides': { fr: 'Slides', en: 'Slides' },
  'editor.slide_label': { fr: 'Slide', en: 'Slide' },
  'editor.slide_blocks': { fr: '{n} blocs', en: '{n} blocks' },
  'editor.loading_editor': {
    fr: 'Chargement de l’éditeur...',
    en: 'Loading editor...',
  },
  'editor.design': { fr: 'Contrôle du design', en: 'Design control' },
  'editor.typography': { fr: 'Typographie', en: 'Typography' },
  'editor.palette': { fr: 'Palette', en: 'Palette' },
  'editor.density': { fr: 'Densité', en: 'Density' },
  'editor.layout': { fr: 'Mise en page', en: 'Layout' },
  'editor.saving_style': { fr: 'Enregistrement...', en: 'Saving...' },
  'editor.apply_style': { fr: 'Appliquer le style', en: 'Apply style' },
  'editor.block_style': { fr: 'Style du bloc', en: 'Block style' },
  'editor.select_block': {
    fr: 'Sélectionne un bloc pour ajuster son style.',
    en: 'Select a block to adjust its style.',
  },
  'editor.alignment': { fr: 'Alignement', en: 'Alignment' },
  'editor.emphasis': { fr: 'Emphase', en: 'Emphasis' },
  'editor.spacing': { fr: 'Espacement', en: 'Spacing' },
  'editor.applying': { fr: 'Application...', en: 'Applying...' },
  'editor.apply_block_style': {
    fr: 'Appliquer le style du bloc',
    en: 'Apply block style',
  },
  'editor.live_preview': { fr: 'Aperçu en direct', en: 'Live preview' },
  'editor.untitled': { fr: 'Sans titre', en: 'Untitled' },
  'editor.topic_placeholder': { fr: 'Sujet', en: 'Topic' },
  'editor.slide_grouping': {
    fr: 'Aperçu du découpage en slides',
    en: 'Slide grouping preview',
  },
  'editor.slide_grouping_empty': {
    fr: 'Ajoute des blocs pour voir le découpage en slides.',
    en: 'Add blocks to see slide grouping.',
  },
  'editor.slide_row': {
    fr: '{n} blocs · {types}',
    en: '{n} blocks · {types}',
  },
  'editor.preview_empty': {
    fr: 'Aucun bloc pour prévisualiser.',
    en: 'No blocks to preview.',
  },
  'editor.auto_layout': { fr: 'Mise en page auto', en: 'Auto-layout' },
  'editor.plan_starter': { fr: 'Plan Starter', en: 'Starter plan' },
  'editor.plan_starter_desc': {
    fr: 'Débloque les exports PPTX, plus de blocs par document et plus de types de documents avec le plan Pro/Ultimate.',
    en: 'Unlock PPTX exports, more blocks per document, and more document types with Pro/Ultimate.',
  },
  'editor.upgrade': { fr: 'Passer au supérieur', en: 'Upgrade now' },
  'editor.err_limit': {
    fr: 'Limite de blocs atteinte pour ce document.',
    en: 'Block limit reached for this document.',
  },
  'editor.err_image_block': {
    fr: 'Impossible de créer le bloc image',
    en: 'Could not create image block',
  },
  'editor.insert_failed': { fr: 'Insertion impossible', en: 'Insert failed' },
  'editor.fallback_title': { fr: 'Bloc titre', en: 'Title block' },
  'editor.fallback_bullets': { fr: 'Liste à puces', en: 'Bullets block' },
  'editor.fallback_image': { fr: 'Bloc image', en: 'Image block' },

  'auth.login.title': { fr: 'Connexion', en: 'Sign in' },
  'auth.login.subtitle': {
    fr: 'Connectez-vous à votre compte',
    en: 'Sign in to your account',
  },
  'auth.login.password': { fr: 'Mot de passe', en: 'Password' },
  'auth.login.ph_password': {
    fr: 'Votre mot de passe',
    en: 'Your password',
  },
  'auth.password.show': {
    fr: 'Afficher le mot de passe',
    en: 'Show password',
  },
  'auth.password.hide': {
    fr: 'Masquer le mot de passe',
    en: 'Hide password',
  },
  'auth.login.submit': { fr: 'Se connecter', en: 'Sign in' },
  'auth.login.no_account': { fr: 'Pas encore de compte ?', en: 'No account yet?' },
  'auth.login.register': { fr: 'S’inscrire', en: 'Sign up' },
  'auth.login.err_invalid': {
    fr: 'Identifiants invalides',
    en: 'Invalid credentials',
  },
  'auth.login.err_unexpected': {
    fr: 'Une erreur inattendue s’est produite',
    en: 'An unexpected error occurred',
  },

  'auth.register.title': { fr: 'Inscription', en: 'Sign up' },
  'auth.register.subtitle': {
    fr: 'Créez votre compte',
    en: 'Create your account',
  },
  'auth.register.name': { fr: 'Nom complet', en: 'Full name' },
  'auth.register.ph_name': { fr: 'Votre nom complet', en: 'Your full name' },
  'auth.register.password': { fr: 'Mot de passe', en: 'Password' },
  'auth.register.ph_password': {
    fr: 'Au moins 8 caractères',
    en: 'At least 8 characters',
  },
  'auth.register.confirm': {
    fr: 'Confirmer le mot de passe',
    en: 'Confirm password',
  },
  'auth.register.ph_confirm': {
    fr: 'Confirmer votre mot de passe',
    en: 'Confirm your password',
  },
  'auth.register.submit': { fr: 'S’inscrire', en: 'Create account' },
  'auth.register.has_account': { fr: 'Déjà un compte ?', en: 'Already have an account?' },
  'auth.register.signin': { fr: 'Se connecter', en: 'Sign in' },
  'auth.register.err_mismatch': {
    fr: 'Les mots de passe ne correspondent pas',
    en: 'Passwords do not match',
  },
  'auth.register.err_short': {
    fr: 'Le mot de passe doit contenir au moins 8 caractères',
    en: 'Password must be at least 8 characters',
  },
  'auth.register.err_generic': {
    fr: 'Une erreur s’est produite',
    en: 'Something went wrong',
  },
  'auth.register.err_unexpected': {
    fr: 'Une erreur inattendue s’est produite',
    en: 'An unexpected error occurred',
  },
  'auth.register.success_title': {
    fr: 'Inscription réussie !',
    en: 'Account created!',
  },
  'auth.register.success_sub': {
    fr: 'Redirection vers la page de connexion...',
    en: 'Redirecting to sign in...',
  },
  'auth.register.redirect_msg': {
    fr: 'Inscription réussie, vous pouvez maintenant vous connecter',
    en: 'Account created. You can now sign in.',
  },

  'create.title': { fr: 'Créer une présentation', en: 'Create presentation' },
  'create.subtitle': {
    fr: 'Décrivez votre sujet et laissez l’IA construire un récit professionnel.',
    en: 'Describe your topic and let AI craft a professional narrative.',
  },
  'create.topic': { fr: 'Sujet *', en: 'Topic *' },
  'create.topic_ph': {
    fr: 'ex. L’avenir de l’intelligence artificielle en santé',
    en: 'e.g. The Future of Artificial Intelligence in Healthcare',
  },
  'create.photos': { fr: 'Photos (optionnel)', en: 'Photos (optional)' },
  'create.photos_hint': {
    fr: 'Ajoutez des images : elles seront intégrées aux slides pertinentes (une image par slide au mieux). Formats image, max 8 Mo chacune.',
    en: 'Add images: they’ll be placed on relevant slides (ideally one image per slide). Image files, 8MB max each.',
  },
  'create.photos_add': { fr: 'Ajouter des photos', en: 'Add photos' },
  'create.photos_remove': { fr: 'Retirer', en: 'Remove' },
  'create.photos_uploading': { fr: 'Envoi…', en: 'Uploading…' },
  'create.photos_error': {
    fr: 'Échec de l’envoi. Êtes-vous connecté·e ?',
    en: 'Upload failed. Are you signed in?',
  },
  'create.photos_limit': {
    fr: 'Maximum {{max}} photos.',
    en: 'Maximum {{max}} photos.',
  },
  'create.audience': { fr: 'Audience', en: 'Audience' },
  'create.tone': { fr: 'Ton', en: 'Tone' },
  'create.detail': { fr: 'Niveau de détail', en: 'Level of detail' },
  'create.slides': { fr: 'Nombre de slides', en: 'Number of slides' },
  'create.slides_min': { fr: '1 slide', en: '1 slide' },
  'create.slides_max': { fr: '20 slides', en: '20 slides' },
  'create.enhance': { fr: 'Enrichir avec', en: 'Enhance with' },
  'create.template': { fr: 'Modèle', en: 'Template' },
  'create.generate': { fr: 'Générer la présentation', en: 'Generate presentation' },
  'create.topic_required': {
    fr: 'Indiquez un sujet avant de générer.',
    en: 'Enter a topic before generating.',
  },
  'create.disabled_need_topic': {
    fr: 'Remplissez le champ « Sujet » pour activer le bouton.',
    en: 'Fill in the topic field to enable the button.',
  },
  'create.photos_uploading_hint': {
    fr: 'Certaines photos sont encore en cours d’envoi — seules les images déjà prêtes seront utilisées.',
    en: 'Some photos are still uploading — only images that finished uploading will be used.',
  },
  'create.generate_no_slides': {
    fr: 'L’IA n’a renvoyé aucune slide. Réessayez ou reformulez le sujet.',
    en: 'The AI returned no slides. Try again or rephrase your topic.',
  },
  'create.generate_note': {
    fr: 'IA avancée pour des slides de qualité · ~15 secondes',
    en: 'Uses advanced AI for higher quality slides · ~15 seconds',
  },
  'create.font_style': { fr: 'Style de police', en: 'Font style' },
  'create.font_export_hint': {
    fr: 'Appliqué à l’export des slides',
    en: 'Applied when exporting slides',
  },

  'create.audience.students': { fr: 'Étudiants', en: 'Students' },
  'create.audience.professors': { fr: 'Professeurs', en: 'Professors' },
  'create.audience.professionals': { fr: 'Professionnels', en: 'Professionals' },
  'create.audience.executives': { fr: 'Dirigeants', en: 'Executives' },

  'create.tone.educational': { fr: 'Pédagogique', en: 'Educational' },
  'create.tone.persuasive': { fr: 'Persuasif', en: 'Persuasive' },
  'create.tone.analytical': { fr: 'Analytique', en: 'Analytical' },
  'create.tone.professional': { fr: 'Professionnel', en: 'Professional' },

  'create.detail.short.title': { fr: 'Court', en: 'Short' },
  'create.detail.short.desc': {
    fr: 'Points clés uniquement',
    en: 'Key points only',
  },
  'create.detail.medium.title': { fr: 'Moyen', en: 'Medium' },
  'create.detail.medium.desc': {
    fr: 'Équilibre fond / forme',
    en: 'Balanced depth',
  },
  'create.detail.detailed.title': { fr: 'Détaillé', en: 'Detailed' },
  'create.detail.detailed.desc': {
    fr: 'Explications complètes',
    en: 'Full detail',
  },

  'create.option.charts': {
    fr: 'Graphiques & visuels de données',
    en: 'Charts & data visuals',
  },
  'create.option.diagrams': {
    fr: 'Schémas & cadres',
    en: 'Diagrams & frameworks',
  },
  'create.option.examples': {
    fr: 'Exemples concrets',
    en: 'Real-world examples',
  },
  'create.option.stats': {
    fr: 'Statistiques & chiffres',
    en: 'Statistics & figures',
  },

  'create.generating.title': {
    fr: 'Génération de votre présentation',
    en: 'Generating your presentation',
  },
  'create.generating.subtitle': {
    fr: 'Récit, structure des slides et contenu en cours…',
    en: 'Crafting narrative, structuring slides, and polishing content…',
  },
  'create.generating.note': {
    fr: 'Cela prend en général 10 à 20 secondes.',
    en: 'This usually takes around 10–20 seconds.',
  },

  'create.font.inter': { fr: 'Moderne · Neutre', en: 'Modern · Neutral' },
  'create.font.serif': { fr: 'Éditorial · Élégant', en: 'Editorial · Elegant' },
  'create.font.mono': { fr: 'Technique · Précis', en: 'Technical · Precise' },
  'create.font.rounded': { fr: 'Convivial · Arrondi', en: 'Friendly · Rounded' },
  'create.font.display': { fr: 'Impact · Présentation', en: 'Bold · Presentation' },
  'create.font.classic-serif': {
    fr: 'Classique · Lisible',
    en: 'Classic · Readable',
  },
  'create.font.luxury': { fr: 'Luxe · Éditorial', en: 'Luxury · Editorial' },
  'create.font.tech': { fr: 'Tech · Minimal', en: 'Tech · Minimal' },
  'create.font.playful': { fr: 'Ludique · Créatif', en: 'Playful · Creative' },

  'create.template_preview_hint': {
    fr: 'Prévisualisez le style des slides avant de lancer la génération.',
    en: 'Preview slide styling before you generate.',
  },
  'create.tpl.modern.name': { fr: 'Indigo Horizon', en: 'Indigo Horizon' },
  'create.tpl.modern.desc': {
    fr: 'Dégradés bleu indigo, blanc lumineux — idéal pitch & produit.',
    en: 'Indigo blues on a bright canvas — perfect for product and pitch decks.',
  },
  'create.tpl.minimalist.name': { fr: 'Quiet Studio', en: 'Quiet Studio' },
  'create.tpl.minimalist.desc': {
    fr: 'Beaucoup d’espace, traits fins et tons pierre — élégance silencieuse.',
    en: 'Lots of space, fine lines, soft stone tones — quiet sophistication.',
  },
  'create.tpl.creative.name': { fr: 'Creative Pop', en: 'Creative Pop' },
  'create.tpl.creative.desc': {
    fr: 'Orange vif, formes organiques — énergie sans agressivité.',
    en: 'Bright orange, organic shapes — bold but friendly energy.',
  },
  'create.tpl.colorful.name': { fr: 'Sunny Spectrum', en: 'Sunny Spectrum' },
  'create.tpl.colorful.desc': {
    fr: 'Ambre, corail et teal — rendu chaleureux et mémorable.',
    en: 'Amber, coral, and teal — warm, memorable, and upbeat.',
  },
  'create.tpl.sunset.name': { fr: 'Golden Hour', en: 'Golden Hour' },
  'create.tpl.sunset.desc': {
    fr: 'Dégradés crépuscule corail-mauve — storytelling émotionnel.',
    en: 'Coral-to-mauve sunset fades — great for storytelling.',
  },
  'create.tpl.corporate.name': { fr: 'Boardroom Elite', en: 'Boardroom Elite' },
  'create.tpl.corporate.desc': {
    fr: 'Bandeau sombre, typo sobre — présentations direction & finance.',
    en: 'Dark band, restrained type — leadership and finance ready.',
  },
  'create.tpl.neon.name': { fr: 'Neon Pulse', en: 'Neon Pulse' },
  'create.tpl.neon.desc': {
    fr: 'Fond sombre, accents fluo — keynote tech & événements.',
    en: 'Dark base, neon accents — tech keynotes and launch vibes.',
  },
  'create.tpl.elegant.name': { fr: 'Gilded Editorial', en: 'Gilded Editorial' },
  'create.tpl.elegant.desc': {
    fr: 'Noir profond et filets dorés — luxe accessible.',
    en: 'Deep black with gold rules — accessible luxury.',
  },
  'create.tpl.ocean.name': { fr: 'Coastal Calm', en: 'Coastal Calm' },
  'create.tpl.ocean.desc': {
    fr: 'Bleus profonds et menthe — santé, bien-être, RSE.',
    en: 'Deep blues with mint — wellness, CSR, and calm brands.',
  },
  'create.tpl.forest.name': { fr: 'Evergreen Story', en: 'Evergreen Story' },
  'create.tpl.forest.desc': {
    fr: 'Verts feuille, tons terre — marques nature & outdoor.',
    en: 'Leaf greens and earth tones — nature and outdoor brands.',
  },
  'create.tpl.luxury.name': { fr: 'Velvet Soirée', en: 'Velvet Soirée' },
  'create.tpl.luxury.desc': {
    fr: 'Platine et bordeaux profond — rendu gala & premium.',
    en: 'Platinum and deep bordeaux — gala-level premium feel.',
  },
  'create.tpl.aurora.name': { fr: 'Boreal Glow', en: 'Boreal Glow' },
  'create.tpl.aurora.desc': {
    fr: 'Violets et cyan d’aurore — créatif & inspiration.',
    en: 'Violet and cyan aurora glow — creative and inspiring.',
  },
  'create.tpl.midnight.name': { fr: 'Moonlight Pro', en: 'Moonlight Pro' },
  'create.tpl.midnight.desc': {
    fr: 'Bleu nuit et contrastes nets — SaaS & consulting.',
    en: 'Night blue with sharp contrast — SaaS and consulting.',
  },
  'create.tpl.rose-gold.name': { fr: 'Blush Copper', en: 'Blush Copper' },
  'create.tpl.rose-gold.desc': {
    fr: 'Rose cuivré et gris perle — lifestyle & beauté.',
    en: 'Copper rose and pearl gray — lifestyle and beauty.',
  },
  'create.tpl.editorial.name': { fr: 'Cover Line', en: 'Cover Line' },
  'create.tpl.editorial.desc': {
    fr: 'Grilles magazine, typo forte — mode & média.',
    en: 'Magazine grids, strong type — fashion and media.',
  },
  'create.tpl.category.business': { fr: 'Business', en: 'Business' },
  'create.tpl.category.creative': { fr: 'Créatif', en: 'Creative' },
  'create.tpl.category.marketing': { fr: 'Marketing', en: 'Marketing' },
  'create.tpl.category.nature': { fr: 'Nature', en: 'Nature' },
  'create.tpl.category.luxury': { fr: 'Luxe', en: 'Luxury' },
  'create.tpl.plan_line': { fr: 'Plan {plan}', en: '{plan} plan' },
  'create.plan.starter': { fr: 'Starter', en: 'Starter' },
  'create.plan.pro': { fr: 'Pro', en: 'Pro' },
  'create.plan.ultimate': { fr: 'Ultimate', en: 'Ultimate' },

  'cv.page_title': { fr: 'CV & lettre IA', en: 'AI CV & letter' },
  'cv.page_sub': {
    fr: 'Remplissez le formulaire ou utilisez une invite — choisissez un modèle, puis affinez et exportez en PDF.',
    en: 'Fill in the form or use a prompt — pick a template, refine, and export to PDF.',
  },
  'cv.tab_prompt': { fr: 'Invite', en: 'Prompt' },
  'cv.tab_manual': { fr: 'Formulaire', en: 'Form' },
  'cv.tab_finance': { fr: 'Finance', en: 'Finance' },
  'cv.finance_intro': {
    fr: 'Structure corporate : remplissez section par section, un paragraphe à la fois.',
    en: 'Corporate layout: fill in one section at a time, one paragraph per block.',
  },
  'cv.finance.role': { fr: 'Poste visé', en: 'Target role' },
  'cv.finance.role_ph': {
    fr: 'Analyste M&A · Auditeur financial services · Analyste FP&A',
    en: 'M&A Analyst · Financial Services Auditor · FP&A Analyst',
  },
  'cv.finance.name': { fr: 'Nom complet', en: 'Full name' },
  'cv.finance.contact': { fr: 'Coordonnées', en: 'Contact details' },
  'cv.finance.contact_ph': {
    fr: 'email@exemple.com · +33 6 00 00 00 00 · Paris',
    en: 'email@example.com · +44 7700 900000 · London',
  },
  'cv.finance.education': { fr: 'Formation', en: 'Education' },
  'cv.finance.education_ph': {
    fr: '2024 · Master Finance · HEC Paris\n2019 · Classe prépa ECE · Lycée Henri IV',
    en: '2024 · MSc Finance · London School of Economics\n2019 · BSc Economics · University of Edinburgh',
  },
  'cv.finance.experience': { fr: 'Expériences', en: 'Experience' },
  'cv.finance.experience_ph': {
    fr: 'Jan. 2022 – déc. 2024 · Analyste M&A · Rothschild & Co\n4 opérations infra (50–200 M€). Modèles LBO, teasers, dataroom.\n\nSept. 2020 – déc. 2021 · Stage audit · Deloitte\nCycle titres, clôture trimestrielle, contrôles IFRS.',
    en: 'Jan 2022 – Dec 2024 · M&A Analyst · Rothschild & Co\n4 infra deals (€50–200M). LBO models, teasers, dataroom.\n\nSep 2020 – Dec 2021 · Audit internship · Deloitte\nSecurities cycle, quarterly close, IFRS controls.',
  },
  'cv.finance.skills': { fr: 'Compétences & outils', en: 'Skills & tools' },
  'cv.finance.skills_ph': {
    fr: 'Excel avancé (VBA), PowerPoint, Bloomberg, DCF / LBO, IFRS, SQL.',
    en: 'Advanced Excel (VBA), PowerPoint, Bloomberg, DCF / LBO, IFRS, SQL.',
  },
  'cv.finance.certifications': {
    fr: 'Certifications & langues (optionnel)',
    en: 'Certifications & languages (optional)',
  },
  'cv.finance.certifications_ph': {
    fr: 'CFA Level I · TOEIC 950 · Anglais courant, espagnol professionnel.',
    en: 'CFA Level I · TOEIC 950 · Fluent English, professional Spanish.',
  },
  'cv.finance.offer': {
    fr: 'Offre / fiche de poste (optionnel)',
    en: 'Job posting (optional)',
  },
  'cv.finance.offer_ph': {
    fr: 'Collez l’offre pour aligner mots-clés et intitulés ATS.',
    en: 'Paste the posting to align ATS keywords and job titles.',
  },
  'cv.prompt_label': { fr: 'Décrivez le profil visé', en: 'Describe the target profile' },
  'cv.prompt_ph': {
    fr: 'Ex. : CV pour un étudiant en marketing avec 2 stages en agence',
    en: 'e.g. CV for a marketing student with two agency internships',
  },
  'cv.manual_name': { fr: 'Nom complet', en: 'Full name' },
  'cv.manual_headline': { fr: 'Titre / accroche', en: 'Headline' },
  'cv.cv_object_label': { fr: 'Objet du CV', en: 'CV objective' },
  'cv.search_period': {
    fr: 'Période / disponibilité recherchée',
    en: 'Target period / availability',
  },
  'cv.photo': { fr: 'Photo de profil', en: 'Profile photo' },
  'cv.photo_create_hint': {
    fr: 'Optionnelle — affichée sur le CV et dans le PDF (JPEG, PNG ou WebP).',
    en: 'Optional — shown on the CV and in the PDF (JPEG, PNG or WebP).',
  },
  'cv.photo_pick': { fr: 'Choisir une image', en: 'Choose image' },
  'cv.photo_clear': { fr: 'Retirer la photo', en: 'Remove photo' },
  'cv.sidebar.ident': { fr: 'Identité', en: 'Identity' },
  'cv.sidebar.contact': { fr: 'Coordonnées', en: 'Contact details' },
  'cv.sidebar.interests': {
    fr: 'Activités & centres d’intérêt',
    en: 'Activities & interests',
  },
  'cv.manual_interests': {
    fr: 'Loisirs / centres d’intérêt (optionnel)',
    en: 'Hobbies / interests (optional)',
  },
  'cv.contact.location': { fr: 'Adresse / ville', en: 'Address / city' },
  'cv.contact.linkedin': { fr: 'LinkedIn (URL)', en: 'LinkedIn (URL)' },
  'cv.manual_summary': { fr: 'Résumé professionnel', en: 'Professional summary' },
  'cv.manual_skills': {
    fr: 'Compétences (une par ligne)',
    en: 'Skills (one per line)',
  },
  'cv.manual_exp': { fr: 'Expériences (JSON simplifié optionnel)', en: 'Experience (optional JSON)' },
  'cv.manual_edu': { fr: 'Formation (JSON optionnel)', en: 'Education (optional JSON)' },
  'cv.locale': { fr: 'Langue du contenu', en: 'Content language' },
  'cv.templates': { fr: 'Modèle de CV', en: 'CV template' },
  'cv.font': { fr: 'Police', en: 'Font' },
  'cv.font.inter': { fr: 'Sans-serif moderne', en: 'Modern sans-serif' },
  'cv.font.georgia': { fr: 'Serif classique', en: 'Classic serif' },
  'cv.font.source': { fr: 'Sans-serif sobre', en: 'Clean sans-serif' },
  'cv.layout': { fr: 'Densité de mise en page', en: 'Layout density' },
  'cv.layout.compact': { fr: 'Compact', en: 'Compact' },
  'cv.layout.normal': { fr: 'Normal', en: 'Normal' },
  'cv.layout.spacious': { fr: 'Aéré', en: 'Spacious' },
  'cv.accent': { fr: 'Couleur d’accent', en: 'Accent color' },
  'cv.generate': { fr: 'Générer', en: 'Generate' },
  'cv.generating': { fr: 'Génération…', en: 'Generating…' },
  'cv.ats_meter_title': {
    fr: 'Optimisation ATS · compatibilité lecteur',
    en: 'ATS optimization · reader parsing',
  },
  'cv.ats_meter_sub': {
    fr: 'Indicateur visuel pendant la création du CV (valeur illustrative, pas un diagnostic réel).',
    en: 'Visual indicator while your CV is created (illustrative only — not a real audit).',
  },
  'cv.ats_score_badge_title': {
    fr: 'ATS Score',
    en: 'ATS Score',
  },
  'cv.ats_score_badge_pct_fmt': {
    fr: '{pct} %',
    en: '{pct}%',
  },
  'cv.upgrade': {
    fr: 'Cette fonctionnalité est réservée aux plans Pro et Ultimate.',
    en: 'This feature is available on Pro and Ultimate plans.',
  },
  'cv.pricing': { fr: 'Voir les tarifs', en: 'View pricing' },
  'cv.tpl.modern': { fr: 'Moderne', en: 'Modern' },
  'cv.tpl.modern.desc': {
    fr: 'Bandeau d’accent, hiérarchie claire.',
    en: 'Accent stripe and clear hierarchy.',
  },
  'cv.tpl.minimalist': { fr: 'Minimaliste', en: 'Minimalist' },
  'cv.tpl.minimalist.desc': {
    fr: 'Beaucoup d’air, lignes fines.',
    en: 'Generous whitespace, light dividers.',
  },
  'cv.tpl.creative': { fr: 'Créatif', en: 'Creative' },
  'cv.tpl.creative.desc': {
    fr: 'Contraste fort, barre latérale colorée.',
    en: 'High contrast with a bold sidebar.',
  },
  'cv.tpl.professional': { fr: 'Professionnel', en: 'Professional' },
  'cv.tpl.professional.desc': {
    fr: 'Style sobre type cabinet / corporate.',
    en: 'Corporate, conservative layout.',
  },
  'cv.tpl.finance': { fr: 'Finance', en: 'Finance' },
  'cv.tpl.finance.desc': {
    fr: 'Corporate, barre d’accent, KPIs et rigueur visuelle.',
    en: 'Corporate layout with accent bar — built for finance KPIs.',
  },
  'cv.tpl.ats': { fr: 'ATS (logiciels de recrutement)', en: 'ATS (applicant tracking)' },
  'cv.tpl.ats.desc': {
    fr: 'Une colonne, titres standard ATS, couleur et photo conservées.',
    en: 'Single column, standard ATS headings — keeps your accent color and photo.',
  },
  'cv.job_description': {
    fr: 'Offre / fiche de poste (optionnel, mots-clés ATS)',
    en: 'Job description (optional, for ATS keywords)',
  },
  'cv.job_description_ph': {
    fr: 'Collez la description du poste visé pour aligner mots-clés et intitulés.',
    en: 'Paste the target job posting to align keywords and standard job titles.',
  },
  'cv.editor_title': { fr: 'Éditeur CV', en: 'CV editor' },
  'cv.tab_preview': { fr: 'Aperçu CV', en: 'CV preview' },
  'cv.tab_letter': { fr: 'Lettre', en: 'Letter' },
  'cv.tab_settings': { fr: 'Réglages', en: 'Settings' },
  'cv.save': { fr: 'Enregistrer', en: 'Save' },
  'cv.saved': { fr: 'Enregistré', en: 'Saved' },
  'cv.export_pdf': { fr: 'Exporter PDF (CV + lettre)', en: 'Export PDF (CV + letter)' },
  'cv.back_studio': { fr: 'Retour studio', en: 'Back to studio' },
  'cv.err_load': { fr: 'Impossible de charger le document.', en: 'Could not load document.' },
  'cv.err_save': { fr: 'Erreur d’enregistrement.', en: 'Save failed.' },
  'cv.sec.profile': { fr: 'Profil', en: 'Profile' },
  'cv.sec.experience': { fr: 'Expérience', en: 'Experience' },
  'cv.sec.education': { fr: 'Formation', en: 'Education' },
  'cv.sec.skills': { fr: 'Compétences', en: 'Skills' },
} as const

export type SiteStrKey = keyof typeof SITE_STRINGS

export function formatSiteString(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] !== undefined ? String(vars[name]) : `{${name}}`,
  )
}
