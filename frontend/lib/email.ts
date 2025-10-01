// Email service abstraction - adapt to your email provider
// Supports multiple providers: Resend, SendGrid, Nodemailer, AWS SES

interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<void>
}

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

interface WelcomeEmailParams {
  to: string
  name: string
  verificationToken: string
}

interface PasswordResetEmailParams {
  to: string
  name: string
  resetToken: string
  expiresIn: string
}

// Email templates
class EmailTemplates {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  }

  welcomeEmail({ name, verificationToken }: Omit<WelcomeEmailParams, 'to'>): { html: string; text: string; subject: string } {
    const verificationUrl = `${this.baseUrl}/verify-email?token=${verificationToken}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Sistema</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        .security-notice { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Bem-vindo ao Sistema!</h1>
        </div>
        <div class="content">
            <h2>Olá, ${name}!</h2>
            <p>Sua conta foi criada com sucesso. Estamos muito felizes em tê-lo conosco!</p>
            
            <p>Para começar a usar todos os recursos do sistema, você precisa verificar seu email:</p>
            
            <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verificar Email</a>
            </div>
            
            <div class="security-notice">
                <strong>🔒 Nota de Segurança:</strong>
                <ul>
                    <li>Este link expira em 24 horas</li>
                    <li>Use uma senha forte e única</li>
                    <li>Nunca compartilhe suas credenciais</li>
                </ul>
            </div>
            
            <p>Se você não criou esta conta, pode ignorar este email com segurança.</p>
            
            <p>Atenciosamente,<br>Equipe do Sistema</p>
        </div>
        <div class="footer">
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>Se você está tendo problemas com o botão, copie e cole este link no seu navegador:<br>
            <a href="${verificationUrl}">${verificationUrl}</a></p>
        </div>
    </div>
</body>
</html>`

    const text = `
Bem-vindo ao Sistema, ${name}!

Sua conta foi criada com sucesso. Para começar a usar o sistema, verifique seu email clicando no link abaixo:

${verificationUrl}

Nota de Segurança:
- Este link expira em 24 horas
- Use uma senha forte e única
- Nunca compartilhe suas credenciais

Se você não criou esta conta, pode ignorar este email.

Atenciosamente,
Equipe do Sistema

---
Este é um email automático, não responda a esta mensagem.
    `.trim()

    return {
      html,
      text,
      subject: '🎉 Bem-vindo! Verifique seu email'
    }
  }

  passwordResetEmail({ name, resetToken, expiresIn }: Omit<PasswordResetEmailParams, 'to'>): { html: string; text: string; subject: string } {
    const resetUrl = `${this.baseUrl}/reset-password?token=${resetToken}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff6b6b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Redefinir Senha</h1>
        </div>
        <div class="content">
            <h2>Olá, ${name}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
            
            <p>Se foi você quem solicitou, clique no botão abaixo para criar uma nova senha:</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul>
                    <li>Este link expira em ${expiresIn}</li>
                    <li>Só pode ser usado uma vez</li>
                    <li>Se você não solicitou, ignore este email</li>
                    <li>Sua senha atual continua válida até você alterá-la</li>
                </ul>
            </div>
            
            <p>Por segurança, recomendamos que você:</p>
            <ul>
                <li>Use uma senha forte com pelo menos 8 caracteres</li>
                <li>Inclua letras maiúsculas, minúsculas, números e símbolos</li>
                <li>Não reutilize senhas de outras contas</li>
            </ul>
            
            <p>Se você não solicitou esta redefinição, pode ignorar este email com segurança. Sua conta permanece protegida.</p>
            
            <p>Atenciosamente,<br>Equipe do Sistema</p>
        </div>
        <div class="footer">
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>Se você está tendo problemas com o botão, copie e cole este link no seu navegador:<br>
            <a href="${resetUrl}">${resetUrl}</a></p>
        </div>
    </div>
</body>
</html>`

    const text = `
Redefinir Senha - ${name}

Recebemos uma solicitação para redefinir a senha da sua conta.

Se foi você quem solicitou, clique no link abaixo:
${resetUrl}

IMPORTANTE:
- Este link expira em ${expiresIn}
- Só pode ser usado uma vez
- Se você não solicitou, ignore este email

Recomendações de segurança:
- Use uma senha forte com pelo menos 8 caracteres
- Inclua maiúsculas, minúsculas, números e símbolos
- Não reutilize senhas de outras contas

Atenciosamente,
Equipe do Sistema

---
Este é um email automático, não responda a esta mensagem.
    `.trim()

    return {
      html,
      text,
      subject: '🔐 Redefinir sua senha'
    }
  }

  securityAlert(params: {
    name: string
    event: string
    ip: string
    timestamp: string
    location?: string
  }): { html: string; text: string; subject: string } {
    const { name, event, ip, timestamp, location } = params
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Alerta de Segurança</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545; }
        .info-box { background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Alerta de Segurança</h1>
        </div>
        <div class="content">
            <h2>Olá, ${name}!</h2>
            
            <div class="alert">
                <strong>Atividade suspeita detectada em sua conta!</strong>
            </div>
            
            <p>Detectamos a seguinte atividade em sua conta:</p>
            
            <div class="info-box">
                <strong>Detalhes do Evento:</strong><br>
                <strong>Evento:</strong> ${event}<br>
                <strong>IP:</strong> ${ip}<br>
                <strong>Data/Hora:</strong> ${timestamp}<br>
                ${location ? `<strong>Localização:</strong> ${location}<br>` : ''}
            </div>
            
            <p><strong>O que fazer:</strong></p>
            <ul>
                <li>Se foi você, pode ignorar este alerta</li>
                <li>Se não reconhece esta atividade, <strong>altere sua senha imediatamente</strong></li>
                <li>Revise os dispositivos conectados à sua conta</li>
                <li>Entre em contato conosco se suspeitar de acesso não autorizado</li>
            </ul>
            
            <p>Sua segurança é nossa prioridade!</p>
            
            <p>Atenciosamente,<br>Equipe de Segurança</p>
        </div>
    </div>
</body>
</html>`

    const text = `
ALERTA DE SEGURANÇA - ${name}

Detectamos atividade suspeita em sua conta:

Evento: ${event}
IP: ${ip}
Data/Hora: ${timestamp}
${location ? `Localização: ${location}` : ''}

O que fazer:
- Se foi você, pode ignorar este alerta
- Se não reconhece, altere sua senha imediatamente
- Revise dispositivos conectados
- Entre em contato se suspeitar de acesso não autorizado

Equipe de Segurança
    `.trim()

    return {
      html,
      text,
      subject: '🚨 Alerta de segurança em sua conta'
    }
  }
}

// Email providers implementation
class ResendProvider implements EmailProvider {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: params.from || 'noreply@exemplo.com',
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
        reply_to: params.replyTo
      })
    })

    if (!response.ok) {
      throw new Error(`Email send failed: ${response.statusText}`)
    }
  }
}

class NodemailerProvider implements EmailProvider {
  private transporter: any

  constructor(config: any) {
    // Note: In a real implementation, you would import nodemailer
    /*
    const nodemailer = require('nodemailer')
    this.transporter = nodemailer.createTransporter(config)
    */
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    /*
    await this.transporter.sendMail({
      from: params.from || process.env.EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo
    })
    */
    throw new Error('Nodemailer not implemented - install nodemailer package')
  }
}

class MockProvider implements EmailProvider {
  async sendEmail(params: SendEmailParams): Promise<void> {
    console.log('📧 Mock Email Send:')
    console.log(`To: ${Array.isArray(params.to) ? params.to.join(', ') : params.to}`)
    console.log(`Subject: ${params.subject}`)
    console.log(`From: ${params.from || 'noreply@sistema.com'}`)
    console.log('---')
    console.log(params.text || 'HTML-only email')
    console.log('---')
  }
}

// Email service class
class EmailService {
  private provider: EmailProvider
  private templates: EmailTemplates

  constructor() {
    this.templates = new EmailTemplates()
    this.provider = this.createProvider()
  }

  private createProvider(): EmailProvider {
    const emailProvider = process.env.EMAIL_PROVIDER || 'mock'

    switch (emailProvider) {
      case 'resend':
        const resendApiKey = process.env.RESEND_API_KEY
        if (!resendApiKey) {
          console.warn('RESEND_API_KEY not found, using mock provider')
          return new MockProvider()
        }
        return new ResendProvider(resendApiKey)

      case 'nodemailer':
        const nodemailerConfig = {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        }
        return new NodemailerProvider(nodemailerConfig)

      default:
        return new MockProvider()
    }
  }

  async sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
    const { html, text, subject } = this.templates.welcomeEmail(params)
    
    await this.provider.sendEmail({
      to: params.to,
      subject,
      html,
      text
    })
  }

  async sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<void> {
    const { html, text, subject } = this.templates.passwordResetEmail(params)
    
    await this.provider.sendEmail({
      to: params.to,
      subject,
      html,
      text
    })
  }

  async sendSecurityAlert(params: {
    to: string
    name: string
    event: string
    ip: string
    timestamp: string
    location?: string
  }): Promise<void> {
    const { html, text, subject } = this.templates.securityAlert(params)
    
    await this.provider.sendEmail({
      to: params.to,
      subject,
      html,
      text
    })
  }

  async sendCustomEmail(params: SendEmailParams): Promise<void> {
    await this.provider.sendEmail(params)
  }
}

// Export singleton instance
const emailService = new EmailService()

export const sendWelcomeEmail = emailService.sendWelcomeEmail.bind(emailService)
export const sendPasswordResetEmail = emailService.sendPasswordResetEmail.bind(emailService)
export const sendSecurityAlert = emailService.sendSecurityAlert.bind(emailService)
export const sendCustomEmail = emailService.sendCustomEmail.bind(emailService)

// Export classes for advanced usage
export { EmailService, EmailTemplates, ResendProvider, NodemailerProvider, MockProvider }
export type { EmailProvider, SendEmailParams, WelcomeEmailParams, PasswordResetEmailParams }