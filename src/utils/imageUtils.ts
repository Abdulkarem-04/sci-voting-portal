const AVATAR_PALETTES = [
  ['#059669', '#064E3B'],
  ['#10B981', '#047857'],
  ['#047857', '#022C22'],
  ['#0D9488', '#115E59'],
  ['#18181B', '#3F3F46'],
  ['#065F46', '#064E3B'],
];

export function getInitials(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'SC';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateSvgAvatarDataUrl(fullName: string, subtitle?: string): string {
  const initials = getInitials(fullName);
  const [c1, c2] = AVATAR_PALETTES[hashString(fullName) % AVATAR_PALETTES.length];
  const safeSubtitle = (subtitle || 'SCI 26/27').replace(/[<>&"']/g, '').slice(0, 14);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="320" height="320" rx="48" fill="url(#bg)" />
  <circle cx="268" cy="52" r="64" fill="#ffffff" fill-opacity="0.07" />
  <circle cx="48" cy="280" r="78" fill="#ffffff" fill-opacity="0.06" />
  <text x="160" y="156" text-anchor="middle" dominant-baseline="central" font-family="Plus Jakarta Sans, sans-serif" font-size="108" font-weight="800" fill="#ffffff" letter-spacing="2">${initials}</text>
  <rect x="82" y="246" width="156" height="28" rx="14" fill="#000000" fill-opacity="0.22" />
  <text x="160" y="261" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#ecfdf5" letter-spacing="1.2">${safeSubtitle}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Resizes and compresses a portrait image file to a 320x320 center-cropped JPEG data URL.
 */
export async function compressPortraitFile(file: File, maxSize = 320): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a valid PNG, JPG, or WebP image file.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image file must be smaller than 10 MB.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not decode the selected image.'));
      el.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = maxSize;
    canvas.height = maxSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context is not available in this browser.');
    }

    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, maxSize, maxSize);
    ctx.drawImage(img, sx, sy, side, side, 0, 0, maxSize, maxSize);

    return canvas.toDataURL('image/jpeg', 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function normalizeAiuStudentId(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('AIIU')) return cleaned.replace(/^AIIU/, 'AIU');
  if (cleaned.startsWith('AIU')) return cleaned;
  if (/^\d{6,10}$/.test(cleaned)) return `AIU${cleaned}`;
  return cleaned;
}

export function isValidAiuEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@student\.aiu\.edu\.my$/i.test(email.trim());
}

export function isValidAdminInviteEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@(?:student\.)?aiu\.edu\.my$/i.test(email.trim());
}

export function shortProgramLabel(program: string): string {
  return program
    .replace('Bachelor in Information Technology (Cybersecurity) (Honours)', 'IT Cybersecurity')
    .replace('Bachelor in Computer Science (Honours)', 'Computer Science')
    .replace('Bachelor in Data Science (Honours)', 'Data Science');
}
