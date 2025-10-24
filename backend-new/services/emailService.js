import sgMail from '@sendgrid/mail';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
  constructor() {
    // Cache for compiled templates
    this.templateCache = new Map();
    
    // Default sender email
    this.defaultFrom = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourcompany.com';
  }

  // Initialize SendGrid API key (called before sending)
  initializeSendGrid() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY not found in environment variables');
    }
    
    // Remove quotes if present
    const cleanApiKey = apiKey.replace(/['"]/g, '');
    
    console.log(`🔑 Initializing SendGrid with API key: ${cleanApiKey.substring(0, 10)}...`);
    sgMail.setApiKey(cleanApiKey);
    
    return cleanApiKey;
  }

  /**
   * Load and compile a Handlebars template
   * @param {string} templateName - Name of the template file (without .hbs extension)
   * @returns {Function} Compiled Handlebars template
   */
  async loadTemplate(templateName) {
    // Check if template is already cached
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName);
    }

    try {
      const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(templateSource);
      
      // Cache the compiled template
      this.templateCache.set(templateName, compiledTemplate);
      
      return compiledTemplate;
    } catch (error) {
      console.error(`❌ Failed to load template ${templateName}:`, error.message);
      throw new Error(`Email template ${templateName} not found or invalid`);
    }
  }

  /**
   * Send email using SendGrid with template
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.template - Template name (without .hbs extension)
   * @param {Object} options.data - Data to populate template variables
   * @param {string} options.from - Sender email (optional, uses default if not provided)
   * @param {Array} options.attachments - Email attachments (optional)
   * @returns {Promise} SendGrid response
   */
  async sendEmail({ to, subject, template, data = {}, from = null, attachments = [] }) {
    try {
      // Initialize SendGrid with current environment
      const apiKey = this.initializeSendGrid();
      
      // Validate required fields
      if (!to || !subject || !template) {
        throw new Error('Missing required fields: to, subject, and template are required');
      }

      // Get clean from email (remove quotes)
      const cleanFromEmail = (from || process.env.SENDGRID_FROM_EMAIL || this.defaultFrom).replace(/['"]/g, '');

      // Load and compile template
      const compiledTemplate = await this.loadTemplate(template);
      
      // Render HTML with data
      const html = compiledTemplate(data);

      // Prepare email message
      const message = {
        to,
        from: cleanFromEmail,
        subject,
        html,
        attachments: attachments.length > 0 ? attachments : undefined
      };

      console.log(`📧 Sending email to ${to} using template ${template}...`);
      console.log(`   From: ${message.from}`);
      console.log(`   API Key: ${apiKey.substring(0, 15)}...`);

      // Send email via SendGrid
      const response = await sgMail.send(message);
      
      console.log(`✅ Email sent successfully to ${to}`, {
        messageId: response[0]?.headers?.['x-message-id'],
        statusCode: response[0]?.statusCode
      });

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
        statusCode: response[0]?.statusCode
      };

    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      console.error('Email error details:', {
        code: error.code,
        response: JSON.stringify(error.response?.body)
      });

      throw error;
    }
  }

  /**
   * Send email with plain HTML (without template)
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML content
   * @param {string} options.from - Sender email (optional)
   * @param {Array} options.attachments - Email attachments (optional)
   * @returns {Promise} SendGrid response
   */
  async sendHtmlEmail({ to, subject, html, from = null, attachments = [] }) {
    try {
      // Initialize SendGrid with current environment
      const apiKey = this.initializeSendGrid();
      
      // Validate required fields
      if (!to || !subject || !html) {
        throw new Error('Missing required fields: to, subject, and html are required');
      }

      // Get clean from email (remove quotes)
      const cleanFromEmail = (from || process.env.SENDGRID_FROM_EMAIL || this.defaultFrom).replace(/['"]/g, '');

      // Prepare email message
      const message = {
        to,
        from: cleanFromEmail,
        subject,
        html,
        attachments: attachments.length > 0 ? attachments : undefined
      };

      console.log(`📧 Sending HTML email to ${to}...`);
      console.log(`   From: ${message.from}`);
      console.log(`   API Key: ${apiKey.substring(0, 15)}...`);

      // Send email via SendGrid
      const response = await sgMail.send(message);
      
      console.log(`✅ Email sent successfully to ${to}`, {
        messageId: response[0]?.headers?.['x-message-id'],
        statusCode: response[0]?.statusCode
      });

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
        statusCode: response[0]?.statusCode
      };

    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      console.error('Email error details:', {
        code: error.code,
        response: error.response?.body
      });

      throw error;
    }
  }

  /**
   * Clear template cache (useful for development)
   */
  clearTemplateCache() {
    this.templateCache.clear();
    console.log('🧹 Email template cache cleared');
  }

  /**
   * Validate email address format
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if SendGrid is properly configured
   * @returns {boolean} True if configured
   */
  isConfigured() {
    const apiKey = process.env.SENDGRID_API_KEY;
    return !!(apiKey && apiKey.replace(/['"]/g, '').startsWith('SG.'));
  }
}

// Export a singleton instance
const emailService = new EmailService();
export default emailService;