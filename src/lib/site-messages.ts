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
  'account.back_home': { fr: 'Retour à l’accueil', en: 'Back to home' },

  'home.hero.badge': {
    fr: 'Présentations IA · prêtes en quelques secondes',
    en: 'AI presentations · ready in seconds',
  },
  'home.hero.title1': {
    fr: 'Transformez votre idée en',
    en: 'Turn your idea into a',
  },
  'home.hero.title2': { fr: 'deck soigné', en: 'polished deck' },
  'home.hero.title3': {
    fr: '— sans l’effort du design.',
    en: '— without the grind.',
  },
  'home.hero.subtitle': {
    fr: 'Décrivez votre sujet une fois. Notre IA structure le récit, les slides et le visuel pour que vous présentiez sereinement — sans passer des heures dans un logiciel.',
    en: 'Describe your topic once. Our AI builds structure, slides, and visuals so you can present with confidence — not spend hours in a slide editor.',
  },
  'home.hero.cta_primary': { fr: 'Commencer gratuitement', en: 'Start for free' },
  'home.hero.cta_secondary': { fr: 'Connexion / Inscription', en: 'Log in / Sign up' },
  'home.hero.note': {
    fr: 'Sans carte bancaire pour essayer · Annulation à tout moment',
    en: 'No credit card required to try · Cancel anytime',
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
    fr: 'Trois étapes entre la page blanche et une présentation convaincante.',
    en: 'Three steps from blank page to standing ovation.',
  },
  'home.how.1.title': { fr: 'Décrivez votre exposé', en: 'Describe your talk' },
  'home.how.1.body': {
    fr: 'Ajoutez un sujet, une audience et un ton. Nous construisons le récit et le découpage en slides.',
    en: 'Add a topic, audience, and tone. We shape a clear narrative and slide flow.',
  },
  'home.how.2.title': { fr: 'Affinez en quelques clics', en: 'Refine in seconds' },
  'home.how.2.body': {
    fr: 'Modifiez les blocs, changez les visuels, ajustez la mise en page — un éditeur calme qui vous laisse penser.',
    en: 'Edit blocks, swap visuals, tune layout — a calm editor that stays out of your way.',
  },
  'home.how.3.title': { fr: 'Exportez & présentez', en: 'Export & present' },
  'home.how.3.body': {
    fr: 'Téléchargez en PDF ou PowerPoint, ou partagez un lien. Soyez impeccable sans stress de dernière minute.',
    en: 'Download PDF or PowerPoint, or share a link. Look sharp without last-minute panic.',
  },
  'home.features.title': {
    fr: 'L’essentiel, sans le superflu',
    en: 'Everything you need, nothing you don’t',
  },
  'home.features.subtitle': {
    fr: 'Un outil focalisé pour ceux qui veulent clarté et vitesse.',
    en: 'A focused toolkit for people who care about clarity and speed.',
  },
  'home.features.1.title': {
    fr: 'Génération ultra rapide',
    en: 'Lightning-fast generation',
  },
  'home.features.1.desc': {
    fr: 'Du prompt à une structure de slides avant la fin de votre café.',
    en: 'Go from prompt to structured slides before your coffee cools.',
  },
  'home.features.2.title': {
    fr: 'Un rendu premium',
    en: 'Designed to look expensive',
  },
  'home.features.2.desc': {
    fr: 'Typographie, espacements et micro-interactions — sans outil de design.',
    en: 'Modern typography, spacing, and motion — without touching a design tool.',
  },
  'home.features.3.title': {
    fr: 'Pensé pour le quotidien',
    en: 'Built for real workflows',
  },
  'home.features.3.desc': {
    fr: 'Exports, limites et offres alignés sur la façon dont les équipes livrent vraiment.',
    en: 'Exports, limits, and plans that match how teams actually ship decks.',
  },
  'home.footer.title': {
    fr: 'Prêt pour votre prochain deck ?',
    en: 'Ready to ship your next deck?',
  },
  'home.footer.subtitle': {
    fr: 'Rejoignez ceux qui utilisent l’IA pour mieux présenter, plus vite.',
    en: 'Join thousands who use AI to present better, faster.',
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
  'pricing.back': { fr: '← Retour à l’accueil', en: '← Back to home' },
  'pricing.tier.starter.name': { fr: 'Starter', en: 'Starter' },
  'pricing.tier.starter.desc': {
    fr: 'Essayez la génération IA et les exports essentiels.',
    en: 'Try AI generation and core exports.',
  },
  'pricing.tier.starter.f1': {
    fr: 'Deck IA à partir d’une invite',
    en: 'AI deck from prompt',
  },
  'pricing.tier.starter.f2': { fr: 'Exports limités', en: 'Limited exports' },
  'pricing.tier.starter.f3': {
    fr: 'Support communautaire',
    en: 'Community support',
  },
  'pricing.tier.starter.cta': { fr: 'Commencer gratuitement', en: 'Start for free' },
  'pricing.tier.starter.period': { fr: 'pour toujours', en: 'forever' },
  'pricing.tier.pro.name': { fr: 'Pro', en: 'Pro' },
  'pricing.tier.pro.desc': {
    fr: 'Pour les créateurs qui livrent des decks chaque semaine.',
    en: 'For creators who ship decks every week.',
  },
  'pricing.tier.pro.f1': {
    fr: 'Limites de génération plus élevées',
    en: 'Higher generation limits',
  },
  'pricing.tier.pro.f2': { fr: 'Export PDF & PPTX', en: 'PDF & PPTX export' },
  'pricing.tier.pro.f3': {
    fr: 'Génération prioritaire',
    en: 'Priority generation',
  },
  'pricing.tier.pro.cta': { fr: 'Souscrire au plan Pro', en: 'Subscribe to Pro' },
  'pricing.tier.pro.period': { fr: '/ mois', en: '/ month' },
  'pricing.tier.ultimate.name': { fr: 'Ultimate', en: 'Ultimate' },
  'pricing.tier.ultimate.desc': {
    fr: 'Collaborez et gardez une identité visuelle cohérente.',
    en: 'Collaborate and keep brand consistency.',
  },
  'pricing.tier.ultimate.f1': { fr: 'Tout le Pro', en: 'Everything in Pro' },
  'pricing.tier.ultimate.f2': {
    fr: 'Espace de travail partagé',
    en: 'Shared workspace',
  },
  'pricing.tier.ultimate.f3': {
    fr: 'Admin & facturation',
    en: 'Admin & billing',
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
    fr: 'Plan {plan} · {max} créations / jour',
    en: 'Plan {plan} · {max} creations / day',
  },
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
    fr: 'Violet et fuchsia, formes organiques — énergie sans agressivité.',
    en: 'Violet and fuchsia, organic shapes — bold but friendly energy.',
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
