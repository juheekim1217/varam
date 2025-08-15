// Block lists
const BLOCKED_EMAILS = ['submissions@searchindex.site'];

const BLOCKED_EMAIL_DOMAINS = [
  'searchindex.site',
  'tempmail.com',
  'spammer.site',
  'searchregister.info',
  'searchregister.site',
  'searchregister.com',
];

const BLOCKED_MESSAGE_KEYWORDS = [
  'searchindex',
  'searchregister',
  'searchindex.site',
  'searchregister.info',
  'submissions@searchindex.site',
  'promotional offer',
  'for your website varam',
  'please click here',
  'AI App',
  'https://',
];

interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

// Validate email inquiries: email and message content
// Returns an object with allowed status and reason if blocked
export function validateEmailInquiry(email: string, message: string): ValidationResult {
  const emailStr = email?.trim().toLowerCase() ?? '';
  const domain = emailStr.split('@')[1] ?? '';
  const messageStr = message?.trim().toLowerCase() ?? '';

  // Check for empty fields
  if (!emailStr || !messageStr) {
    return { allowed: false, reason: 'Missing required fields' };
  }

  // 1. Check for blocked emails
  if (BLOCKED_EMAILS.includes(emailStr)) {
    return { allowed: false, reason: 'Email address not allowed' };
  }

  // 2. Check for blocked domains
  if (BLOCKED_EMAIL_DOMAINS.some((d) => domain.endsWith(d))) {
    return { allowed: false, reason: 'Email domain not allowed' };
  }

  // 3. Check for blocked message keywords
  if (BLOCKED_MESSAGE_KEYWORDS.some((keyword) => messageStr.includes(keyword))) {
    return { allowed: false, reason: 'Message contains blocked keywords' };
  }

  return { allowed: true };
}

export function validateEmail(email: string): ValidationResult {
  const emailStr = email?.trim().toLowerCase() ?? '';
  const domain = emailStr.split('@')[1] ?? '';

  // Check for empty fields
  if (!emailStr) {
    return { allowed: false, reason: 'Missing required fields' };
  }

  // 1. Check for blocked emails
  if (BLOCKED_EMAILS.includes(emailStr)) {
    return { allowed: false, reason: 'Email address not allowed' };
  }

  // 2. Check for blocked domains
  if (BLOCKED_EMAIL_DOMAINS.some((d) => domain.endsWith(d))) {
    return { allowed: false, reason: 'Email domain not allowed' };
  }

  return { allowed: true };
}
