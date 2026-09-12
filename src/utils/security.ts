/**
 * HUNDRED BUILDERS REALITIES - High-Grade Security Engine
 * Comprehensive Cyber-Defense, Anti-Hacking & Privacy Safeguards
 * 
 * Includes:
 * - Anti-XSS and Injection Sanitization
 * - Safe URL & Safe Filename Resolvers
 * - Indian UIDAI-Compliant Aadhaar / PAN / Banking Data Masking
 * - File Upload Armor (Malware, SVG-XSS & Executable Blocking)
 * - Anti-Bot Honeypot & Client-Side Rate Limiter
 * - Tamper-Evident Storage (Obfuscation & Integrity Hashing)
 */

// 1. Text & Input Sanitization (Cross-Site Scripting / XSS Defense)
export function sanitizeText(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    return String(input).slice(0, maxLength);
  }

  let clean = input.trim();

  // Truncate to avoid memory exhaustion / payload flooding
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }

  // Strip null bytes and control chars (except standard newline/tab)
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Neutralize dangerous script, iframe, object, embed, svg tags
  clean = clean.replace(/<\s*(script|iframe|object|embed|applet|style|form|meta|link|svg)\b[^>]*>.*?<\s*\/\s*\1\s*>/gis, '');
  clean = clean.replace(/<\s*(script|iframe|object|embed|applet|style|form|meta|link|svg)\b[^>]*>/gis, '');

  // Strip dangerous javascript: and data: pseudo-protocols
  clean = clean.replace(/(javascript|vbscript|data):/gi, '$1_blocked:');

  // Neutralize inline event handlers like onload=, onerror=, onclick=
  clean = clean.replace(/\bon[a-z]{3,15}\s*=/gi, 'data-blocked-handler=');

  return clean;
}

// 2. Safe URL Validator (Protects against javascript: URI Injection)
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Block dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('data:image/svg+xml') ||
    lower.startsWith('file:')
  ) {
    console.warn('[Security Shield] Blocked suspicious URL scheme:', trimmed);
    return '';
  }

  // Accept valid relative paths or standard http/https/blob/trusted data image
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('data:image/jpeg') ||
    trimmed.startsWith('data:image/png') ||
    trimmed.startsWith('data:image/webp') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Otherwise reject
  return '';
}

// 3. File Upload Armor (Blocks Malware, SVG Script Injections & Executables)
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  cleanedName?: string;
}

const FORBIDDEN_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'php', 'pl', 'cgi', 'js', 'vbs', 'scr', 'msi',
  'com', 'pif', 'jar', 'apk', 'bin', 'dll', 'sys', 'svg', 'htm', 'html', 'xhtml'
]);

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf'
]);

export function sanitizeFileName(rawName: string): string {
  if (!rawName) return 'unnamed_file';
  // Strip path traversal attempts and special symbols
  let clean = rawName.replace(/[/\\?%*:|"<>]/g, '_');
  clean = clean.replace(/\.\./g, '_');
  clean = clean.replace(/[\x00-\x1f\x7f]/g, '');
  return clean.slice(0, 100);
}

export function validateUploadedFile(file: File, maxSizeBytes = 5 * 1024 * 1024): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'फ़ाइल उपलब्ध नहीं है (No file provided)' };
  }

  // Size guard (default 5 MB)
  if (file.size > maxSizeBytes) {
    const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `फ़ाइल का आकार ${sizeMb} MB से अधिक नहीं हो सकता (File exceeds ${sizeMb}MB limit)` };
  }

  const fileName = file.name || '';
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // Check forbidden extensions
  if (FORBIDDEN_EXTENSIONS.has(ext)) {
    return { 
      valid: false, 
      error: `असुरक्षित फ़ाइल एक्सटेंशन (.${ext}) अस्वीकृत है। केवल JPG, PNG, WEBP या PDF अपलोड करें।` 
    };
  }

  // Check MIME type
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    // If MIME doesn't match standard image/pdf
    return { 
      valid: false, 
      error: 'केवल वैध दस्तावेज़ (JPG, PNG, WEBP, PDF) ही स्वीकार्य हैं।' 
    };
  }

  return {
    valid: true,
    cleanedName: sanitizeFileName(fileName)
  };
}

// 4. Sensitive Data Masking (UIDAI Aadhaar, PAN & Banking Privacy Compliance)
export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar) return '';
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length === 12) {
    return `XXXX-XXXX-${clean.slice(8)}`;
  }
  // If partial or formatted
  if (clean.length > 4) {
    return `${'X'.repeat(clean.length - 4)}${clean.slice(-4)}`;
  }
  return 'XXXX';
}

export function maskPAN(pan: string): string {
  if (!pan) return '';
  const clean = pan.trim().toUpperCase();
  if (clean.length === 10) {
    // Standard masking: XXXXX1234F
    return `XXXXX${clean.slice(5)}`;
  }
  return clean.replace(/.(?=.{2})/g, 'X');
}

export function maskBankAccount(accountNumber: string): string {
  if (!accountNumber) return '';
  const clean = accountNumber.replace(/\s+/g, '');
  if (clean.length > 4) {
    return `${'X'.repeat(clean.length - 4)}${clean.slice(-4)}`;
  }
  return 'XXXX';
}

export function maskPhone(phone: string): string {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 2)}XXXXXX${clean.slice(8)}`;
  }
  return phone;
}

// 5. Input Format Validations
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(digits);
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 100) return false;
  // RFC 5322 standard regex subset
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

export function isValidAadhaar(aadhaar: string): boolean {
  const clean = aadhaar.replace(/\s+/g, '');
  return /^\d{12}$/.test(clean);
}

export function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
}

export function isValidIFSC(ifsc: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase());
}

// 6. Anti-Bot Honeypot Detector
export function isHoneypotTriggered(honeypotVal: string | undefined): boolean {
  // If the hidden honeypot input is filled with any content, it is an automated bot
  return Boolean(honeypotVal && honeypotVal.trim().length > 0);
}

// 7. Client-Side Anti-Spam / Rate Limiter
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

export function checkRateLimit(
  actionKey: string,
  maxAttempts = 5,
  windowMs = 60000 // 1 minute
): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  if (!rateLimitStore[actionKey]) {
    rateLimitStore[actionKey] = { timestamps: [] };
  }

  const record = rateLimitStore[actionKey];
  // Filter out timestamps outside window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxAttempts) {
    const oldest = record.timestamps[0];
    const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
    return { allowed: false, retryAfterSec: Math.max(1, retryAfterSec) };
  }

  record.timestamps.push(now);
  return { allowed: true };
}

// 8. Tamper-Evident Storage (Obfuscation + Checksum verification)
function computeChecksum(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export function secureStore(key: string, data: unknown): boolean {
  try {
    const rawString = JSON.stringify(data);
    const checksum = computeChecksum(rawString);
    // Base64 encoding with integrity metadata
    const payload = {
      v: 2,
      ts: Date.now(),
      cs: checksum,
      d: btoa(encodeURIComponent(rawString))
    };
    localStorage.setItem(`_hbr_sec_${key}`, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('[Security Engine] Secure store failure:', err);
    return false;
  }
}

export function secureRetrieve<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`_hbr_sec_${key}`);
    if (!item) {
      // Check legacy non-secure storage fallback
      const legacy = localStorage.getItem(key);
      if (legacy) {
        try {
          return JSON.parse(legacy) as T;
        } catch {
          return fallback;
        }
      }
      return fallback;
    }

    const parsed = JSON.parse(item);
    if (!parsed || !parsed.d || !parsed.cs) return fallback;

    const rawString = decodeURIComponent(atob(parsed.d));
    const actualChecksum = computeChecksum(rawString);

    // Tamper detection: verify checksum
    if (actualChecksum !== parsed.cs) {
      console.warn(`[Security Alert] Tampered data detected for key: ${key}. Discarding safely.`);
      return fallback;
    }

    return JSON.parse(rawString) as T;
  } catch (err) {
    console.error('[Security Engine] Secure retrieve failed:', err);
    return fallback;
  }
}
