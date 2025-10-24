# Email System Setup - SendGrid with Handlebars Templates

This project has been updated to use SendGrid for email delivery with Handlebars templates for dynamic content. This README explains how to configure and use the new email system.

## Table of Contents
- [Prerequisites](#prerequisites)
- [SendGrid Setup](#sendgrid-setup)
- [Environment Configuration](#environment-configuration)
- [Email Templates](#email-templates)
- [Usage Examples](#usage-examples)
- [Migration from Nodemailer](#migration-from-nodemailer)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. **SendGrid Account**: Sign up at [SendGrid](https://sendgrid.com/)
2. **Verified Sender**: Configure a verified sender identity in SendGrid
3. **API Key**: Generate an API key with Mail Send permissions

## SendGrid Setup

### 1. Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com/) and sign up
2. Verify your email address
3. Complete the account setup

### 2. Create API Key
1. Go to Settings → API Keys in SendGrid dashboard
2. Click "Create API Key"
3. Choose "Restricted Access"
4. Give it a name (e.g., "Production API Key")
5. Grant "Mail Send" permissions
6. Click "Create & View"
7. **Important**: Copy the API key immediately (you won't see it again)

### 3. Verify Sender Identity
1. Go to Settings → Sender Authentication
2. Choose "Single Sender Verification" (for basic setup)
3. Add your email address and complete verification
4. For production, consider "Domain Authentication" for better deliverability

## Environment Configuration

Update your `.env` file with SendGrid configuration:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
EMAIL_FROM=noreply@yourdomain.com

# Optional: Company branding
COMPANY_NAME=Your Company Name
```

### Required Environment Variables:
- `SENDGRID_API_KEY`: Your SendGrid API key (starts with "SG.")
- `SENDGRID_FROM_EMAIL`: Default sender email (must be verified in SendGrid)
- `EMAIL_FROM`: Fallback sender email
- `COMPANY_NAME`: Used in email templates (optional)

## Email Templates

Email templates are located in `backend/templates/emails/` directory and use Handlebars syntax for dynamic content.

### Available Templates:

#### 1. Video Call Invitation (`video-call-invitation.hbs`)
Used for sending video call invitations to customers.

**Template Variables:**
- `customerName` - Customer's name
- `joinUrl` - URL to join the video call
- `sessionDetails` - Object with optional session details
  - `date` - Session date
  - `time` - Session time  
  - `duration` - Expected duration
  - `agenda` - Meeting agenda
- `currentYear` - Current year for footer
- `companyName` - Company name
- `validityPeriod` - How long the invitation is valid

#### 2. Welcome Email (`welcome.hbs`)
Used for welcoming new users.

**Template Variables:**
- `userName` - User's name
- `subtitle` - Custom subtitle (optional)
- `personalMessage` - Custom welcome message
- `nextSteps` - Array of next steps
- `actionUrl` - Call-to-action URL
- `actionText` - Call-to-action button text
- `supportInfo` - Support information

#### 3. Notification (`notification.hbs`)
Used for general notifications with different types (info, warning, success, error).

**Template Variables:**
- `type` - Notification type: "info", "warning", "success", "error"
- `icon` - Custom icon (emoji or text)
- `title` - Notification title
- `subtitle` - Notification subtitle
- `greeting` - Custom greeting
- `message` - Main notification message
- `details` - Additional details (can be object with `list` array or string)
- `actionUrl` - Action button URL
- `actionText` - Action button text
- `timestamp` - When the notification occurred

### Creating Custom Templates

1. Create a new `.hbs` file in `backend/templates/emails/`
2. Use Handlebars syntax for dynamic content: `{{variableName}}`
3. Use conditional blocks: `{{#if condition}}...{{/if}}`
4. Use loops: `{{#each array}}...{{/each}}`

Example template structure:
```handlebars
<!DOCTYPE html>
<html>
<head>
    <title>{{subject}}</title>
    <style>
        /* CSS styles here */
    </style>
</head>
<body>
    <h1>Hello {{userName}}!</h1>
    
    {{#if customMessage}}
    <p>{{customMessage}}</p>
    {{else}}
    <p>Default message here</p>
    {{/if}}
    
    {{#each items}}
    <li>{{this}}</li>
    {{/each}}
</body>
</html>
```

## Usage Examples

### Using Email Service in Your Code

```javascript
import emailService from './services/emailService.js';

// Send email with template
try {
  const result = await emailService.sendEmail({
    to: 'customer@example.com',
    subject: 'Video Call Invitation',
    template: 'video-call-invitation',
    data: {
      customerName: 'John Doe',
      joinUrl: 'https://yourapp.com/call/123',
      currentYear: new Date().getFullYear(),
      companyName: 'Your Company'
    }
  });
  
  console.log('Email sent:', result.messageId);
} catch (error) {
  console.error('Failed to send email:', error);
}

// Send email with custom HTML (without template)
try {
  const result = await emailService.sendHtmlEmail({
    to: 'user@example.com',
    subject: 'Custom Email',
    html: '<h1>Hello!</h1><p>This is a custom email.</p>'
  });
} catch (error) {
  console.error('Failed to send email:', error);
}

// Send welcome email
await emailService.sendEmail({
  to: 'newuser@example.com',
  subject: 'Welcome to Our Platform!',
  template: 'welcome',
  data: {
    userName: 'Jane Smith',
    subtitle: 'Thanks for joining us',
    nextSteps: [
      'Complete your profile',
      'Explore our features',
      'Contact support if needed'
    ],
    actionUrl: 'https://yourapp.com/onboarding',
    actionText: 'Get Started'
  }
});

// Send notification
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Important Update',
  template: 'notification',
  data: {
    type: 'warning',
    icon: '⚠️',
    title: 'System Maintenance',
    message: 'We will be performing maintenance tonight.',
    details: {
      list: [
        'Maintenance window: 2 AM - 4 AM EST',
        'Services may be temporarily unavailable',
        'No action required from you'
      ]
    },
    timestamp: new Date().toLocaleString()
  }
});
```

### Email Service Methods

#### `sendEmail(options)`
Send email using a Handlebars template.

**Options:**
- `to` (string): Recipient email address
- `subject` (string): Email subject
- `template` (string): Template name (without .hbs extension)
- `data` (object): Template variables
- `from` (string, optional): Sender email
- `attachments` (array, optional): File attachments

#### `sendHtmlEmail(options)`
Send email with custom HTML content.

**Options:**
- `to` (string): Recipient email address
- `subject` (string): Email subject
- `html` (string): HTML content
- `from` (string, optional): Sender email
- `attachments` (array, optional): File attachments

#### `validateEmail(email)`
Validate email address format.

#### `isConfigured()`
Check if SendGrid is properly configured.

#### `clearTemplateCache()`
Clear template cache (useful in development).

## Migration from Nodemailer

The old Nodemailer implementation has been replaced with SendGrid. Here's what changed:

### Before (Nodemailer):
```javascript
const transporter = nodemailer.createTransporter({...});
await transporter.sendMail({
  to: 'user@example.com',
  subject: 'Subject',
  html: 'HTML content...'
});
```

### After (SendGrid + Templates):
```javascript
import emailService from './services/emailService.js';

await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Subject',
  template: 'template-name',
  data: { variable: 'value' }
});
```

### Configuration Changes:
- Remove: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Add: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`

## Troubleshooting

### Common Issues:

#### 1. "SENDGRID_API_KEY not found"
- Ensure your `.env` file contains `SENDGRID_API_KEY=SG.your_key_here`
- Restart your server after updating `.env`

#### 2. "Email template not found"
- Check that the template file exists in `backend/templates/emails/`
- Ensure the filename matches exactly (case-sensitive)
- Template names should not include the `.hbs` extension

#### 3. "Unauthorized" error from SendGrid
- Verify your API key is correct and not expired
- Ensure the API key has "Mail Send" permissions
- Check that you're using the full API key (starts with "SG.")

#### 4. "Sender not verified"
- Go to SendGrid dashboard → Settings → Sender Authentication
- Verify the sender email address you're using
- For production, set up domain authentication

#### 5. Template rendering issues
- Check Handlebars syntax in your templates
- Ensure all required variables are provided in the `data` object
- Use `{{#if variable}}` to handle optional variables

### Testing Email Setup:

```javascript
// Test if SendGrid is configured
console.log('SendGrid configured:', emailService.isConfigured());

// Test email validation
console.log('Valid email:', emailService.validateEmail('test@example.com'));

// Send test email
try {
  await emailService.sendEmail({
    to: 'your-email@example.com',
    subject: 'Test Email',
    template: 'notification',
    data: {
      type: 'info',
      title: 'Test',
      message: 'This is a test email from your SendGrid setup.'
    }
  });
  console.log('Test email sent successfully!');
} catch (error) {
  console.error('Test email failed:', error.message);
}
```

### Debug Mode:

Enable detailed logging by setting environment variable:
```env
NODE_ENV=development
```

This will show more detailed error messages and SendGrid responses.

## Best Practices

1. **Template Organization**: Keep templates organized by purpose (transactional, marketing, notifications)
2. **Error Handling**: Always wrap email sending in try-catch blocks
3. **Rate Limiting**: Be aware of SendGrid's sending limits
4. **Testing**: Test emails thoroughly in development before production
5. **Monitoring**: Monitor email delivery rates and bounces in SendGrid dashboard
6. **Security**: Never commit API keys to version control
7. **Fallbacks**: Handle email failures gracefully without breaking user flows

## Support

For SendGrid-specific issues, check:
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference/mail-send/mail-send)
- [Handlebars Documentation](https://handlebarsjs.com/guide/)

For project-specific issues, contact your development team.