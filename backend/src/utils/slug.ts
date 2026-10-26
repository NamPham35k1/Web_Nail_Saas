// Reserved slugs that cannot be claimed by any salon
export const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'auth',
  'login',
  'register',
  'signup',
  'signin',
  'onboarding',
  'dashboard',
  'settings',
  'profile',
  'public',
  'assets',
  'static',
  'help',
  'support',
  'terms',
  'privacy',
  'pricing',
  'billing',
  'app',
  'system',
  'nailvibe'
]);

/**
 * Converts Vietnamese string with accents to non-accent lowercase
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd');
}

/**
 * Generates a clean URL slug from a salon name
 */
export function generateSlug(name: string): string {
  const clean = removeVietnameseAccents(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')        // collapse whitespace to hyphen
    .replace(/-+/g, '-')         // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');    // trim hyphens

  return clean || 'tiem-nail';
}

/**
 * Validates slug format
 */
export function isValidSlug(slug: string): { valid: boolean; message?: string } {
  if (!slug || slug.length < 3) {
    return { valid: false, message: 'Slug phải có ít nhất 3 ký tự.' };
  }
  if (slug.length > 40) {
    return { valid: false, message: 'Slug không được dài quá 40 ký tự.' };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { valid: false, message: 'Slug chỉ được chứa chữ thường (a-z), số (0-9) và dấu gạch ngang giữa các từ.' };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { valid: false, message: `Slug '${slug}' là từ khóa hệ thống, vui lòng chọn slug khác.` };
  }
  return { valid: true };
}
