import { describe, it, expect } from 'vitest';
import { extractEmbedUrl, validateEmbedUrl } from '../embedUtils';

describe('embedUtils security & parsing tests', () => {
  it('extracts URL from direct URL string', () => {
    const directUrl = 'https://taifood-blog.asia/embed/nfl-network';
    expect(extractEmbedUrl(directUrl)).toBe(directUrl);
  });

  it('safely extracts src from raw iframe HTML string without DOM injection', () => {
    const iframeSnippet = '<iframe src="https://taifood-blog.asia/embed/south-park" width="100%" height="100%"></iframe>';
    expect(extractEmbedUrl(iframeSnippet)).toBe('https://taifood-blog.asia/embed/south-park');
  });

  it('validates authorized allowlisted origins successfully', () => {
    const validUrls = [
      'https://taifood-blog.asia/embed/game-123',
      'https://api.ppv.st/embed/stream',
      'https://ppv.st/embed/game',
      'https://thumbs.poocloud.in/embed/preview',
      'https://ppv.tj/embed/game',
    ];

    for (const url of validUrls) {
      const result = validateEmbedUrl(url);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe(url);
    }
  });

  it('rejects unauthorized or unknown origins', () => {
    const invalidOrigins = [
      'https://unauthorized-stream.com/embed/123',
      'https://phishing-site.org/watch',
      'https://malicious.net/iframe',
    ];

    for (const url of invalidOrigins) {
      const result = validateEmbedUrl(url);
      expect(result.isValid).toBe(false);
      expect(result.sanitizedUrl).toBeNull();
      expect(result.rejectionReason).toContain('not on the authorized provider allowlist');
    }
  });

  it('rejects insecure HTTP protocol', () => {
    const insecureUrl = 'http://taifood-blog.asia/embed/insecure';
    const result = validateEmbedUrl(insecureUrl);
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toContain('HTTPS');
  });

  it('handles null, undefined, empty, and malformed inputs gracefully', () => {
    expect(validateEmbedUrl(null).isValid).toBe(false);
    expect(validateEmbedUrl(undefined).isValid).toBe(false);
    expect(validateEmbedUrl('').isValid).toBe(false);
    expect(validateEmbedUrl('not-a-valid-url').isValid).toBe(false);
  });
});
