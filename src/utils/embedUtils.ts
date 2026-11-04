/**
 * Allowlist of authorized embed origins provided by the PPV.st service and its partners.
 * Any URL not matching this strict origin allowlist will be rejected.
 */
const ALLOWED_ORIGIN_PATTERNS: RegExp[] = [
  /^https:\/\/(?:[a-z0-9-]+\.)?taifood-blog\.asia(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?ppv\.st(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?ppvservices\.st(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?poocloud\.in(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?ppv\.tj(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?ppvs\.pk(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?ppv\.rw(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?ppv\.ms(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?ppv\.bi(?::[0-9]+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?ppv\.ug(?::[0-9]+)?$/,
];

export interface EmbedValidationResult {
  isValid: boolean;
  sanitizedUrl: string | null;
  origin?: string;
  rejectionReason?: string;
}

/**
 * Extracts a URL from either a raw URL string or an <iframe src="..."> HTML snippet
 * without executing or dangerously injecting HTML into the DOM.
 */
export function extractEmbedUrl(rawEmbed?: string | null): string | null {
  if (!rawEmbed || typeof rawEmbed !== 'string') {
    return null;
  }

  const trimmed = rawEmbed.trim();

  // If it's already a clean http/https URL
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }

  // If it's an iframe snippet like <iframe ... src="https://..." ...>
  if (trimmed.toLowerCase().includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  return null;
}

/**
 * Validates the embed URL against the strict allowlist of authorized origins.
 * Ensures HTTPS, valid structure, and authorized domain.
 */
export function validateEmbedUrl(rawEmbed?: string | null): EmbedValidationResult {
  const extracted = extractEmbedUrl(rawEmbed);

  if (!extracted) {
    return {
      isValid: false,
      sanitizedUrl: null,
      rejectionReason: 'No embed URL provided in the stream data.',
    };
  }

  try {
    const urlObj = new URL(extracted);

    // Require HTTPS
    if (urlObj.protocol !== 'https:') {
      return {
        isValid: false,
        sanitizedUrl: null,
        rejectionReason: 'Embed URL must use secure HTTPS protocol.',
      };
    }

    const origin = urlObj.origin;
    const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));

    if (!isAllowed) {
      return {
        isValid: false,
        sanitizedUrl: null,
        origin,
        rejectionReason: `Embed origin (${origin}) is not on the authorized provider allowlist.`,
      };
    }

    return {
      isValid: true,
      sanitizedUrl: urlObj.toString(),
      origin,
    };
  } catch {
    return {
      isValid: false,
      sanitizedUrl: null,
      rejectionReason: 'Malformed embed URL format.',
    };
  }
}
