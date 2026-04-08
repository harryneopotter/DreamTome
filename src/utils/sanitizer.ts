/**
 * Basic sanitization utility to strip HTML-like tags and characters from user input.
 * This helps prevent XSS attacks by ensuring no HTML is stored or rendered.
 */
export function sanitize(text: string): string {
  if (typeof text !== 'string') return text;

  let sanitized = text;
  // Repeatedly remove tags and angle brackets to handle nested or tricky cases
  let previous;
  do {
    previous = sanitized;
    sanitized = sanitized
      .replace(/<[^>]*>?/gm, '') // Remove <tag> and <tag
      .replace(/</g, '')         // Remove remaining <
      .replace(/>/g, '');        // Remove remaining >
  } while (sanitized !== previous);

  return sanitized.trim();
}

/**
 * Sanitizes an array of strings.
 */
export function sanitizeArray(tags: string[]): string[] {
  if (!Array.isArray(tags)) return tags;
  return tags.map(tag => sanitize(tag));
}
