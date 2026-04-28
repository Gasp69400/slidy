import nodemailer from 'nodemailer'

function publicAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  )
}

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailAlertData {
  to: string
  subject: string
  message: string
  clientName: string
  propertyTitle?: string
  propertyPrice?: number
  propertyUrl?: string
}

/**
 * Envoie une alerte par email
 */
export async function sendEmailAlert(data: EmailAlertData): Promise<void> {
  const {
    to,
    subject,
    message,
    clientName,
    propertyTitle,
    propertyPrice,
    propertyUrl,
  } = data

  const html = generateEmailHTML(data)
  const text = generateEmailText(data)

  try {
    await transporter.sendMail({
      from: `"Immobilier SaaS" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    })

    console.log(`Email alert sent to ${to}`)
  } catch (error) {
    console.error('Failed to send email alert:', error)
    throw error
  }
}

/**
 * Génère le contenu HTML de l'email
 */
function generateEmailHTML(data: EmailAlertData): string {
  const {
    message,
    clientName,
    propertyTitle,
    propertyPrice,
    propertyUrl,
  } = data

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alerte Immobilière</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .property-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0; background: #f9f9f9; }
        .price { font-size: 24px; font-weight: bold; color: #2563eb; margin: 10px 0; }
        .cta-button { display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏠 Alerte Immobilière</h1>
      </div>

      <div class="content">
        <p>Bonjour ${clientName},</p>

        <p>${message}</p>

        ${propertyTitle ? `
          <div class="property-card">
            <h3>${propertyTitle}</h3>
            ${propertyPrice ? `<div class="price">${propertyPrice.toLocaleString('fr-FR')} €</div>` : ''}
            ${propertyUrl ? `<a href="${propertyUrl}" class="cta-button">Voir l'annonce →</a>` : ''}
          </div>
        ` : ''}

        <p>
          Connectez-vous à votre <a href="${publicAppUrl()}/studio">tableau de bord</a>
          pour voir tous les détails.
        </p>

        <div class="footer">
          <p>
            Cet email a été envoyé automatiquement par Immobilier SaaS.<br>
            Vous recevez cette alerte car vous suivez des recherches immobilières.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Génère le contenu texte de l'email (fallback)
 */
function generateEmailText(data: EmailAlertData): string {
  const {
    message,
    clientName,
    propertyTitle,
    propertyPrice,
    propertyUrl,
  } = data

  let text = `Bonjour ${clientName},\n\n${message}\n\n`

  if (propertyTitle) {
    text += `Bien trouvé: ${propertyTitle}\n`
    if (propertyPrice) text += `Prix: ${propertyPrice.toLocaleString('fr-FR')} €\n`
    if (propertyUrl) text += `Lien: ${propertyUrl}\n\n`
  }

  text += `Connectez-vous à votre tableau de bord: ${publicAppUrl()}/studio\n\n`
  text += `Cet email a été envoyé automatiquement par Immobilier SaaS.`

  return text
}

/**
 * Envoie un email de bienvenue à un nouveau client
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>Bienvenue sur Immobilier SaaS</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1>🏠 Bienvenue sur Immobilier SaaS</h1>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Bonjour ${name},</p>

        <p>Félicitations ! Votre compte Immobilier SaaS a été créé avec succès.</p>

        <p>Commencez dès maintenant à automatiser vos recherches immobilières :</p>

        <ul>
          <li>🔍 Scraping automatique sur Leboncoin, SeLoger, PAP et ParuVendu</li>
          <li>🎯 Matching intelligent avec algorithme IA</li>
          <li>📧 Alertes automatiques par email</li>
          <li>📊 Dashboard complet pour suivre vos clients</li>
        </ul>

        <a href="${publicAppUrl()}/studio" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
          Accéder à mon compte →
        </a>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666;">
          <p>
            Cet email a été envoyé automatiquement par Immobilier SaaS.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `Bonjour ${name},

Félicitations ! Votre compte Immobilier SaaS a été créé avec succès.

Commencez dès maintenant à automatiser vos recherches immobilières :
- Scraping automatique sur Leboncoin, SeLoger, PAP et ParuVendu
- Matching intelligent avec algorithme IA
- Alertes automatiques par email
- Dashboard complet pour suivre vos clients

Accédez à votre compte : ${publicAppUrl()}/studio

Cet email a été envoyé automatiquement par Immobilier SaaS.`

  try {
    await transporter.sendMail({
      from: `"Immobilier SaaS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Bienvenue sur Immobilier SaaS',
      text,
      html,
    })

    console.log(`Welcome email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw error
  }
}

/**
 * Envoie un email de test pour vérifier la configuration
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"Test Email" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Test - Configuration email',
      html: `
        <h1>Test réussi !</h1>
        <p>La configuration email fonctionne correctement.</p>
        <p>Envoyé le: ${new Date().toLocaleString('fr-FR')}</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true

  } catch (error) {
    console.error('Test email failed:', error)
    return false
  }
}
