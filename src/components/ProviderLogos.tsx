// Official brand marks, inline so they render with no extra network request.
// Google's four-colour "G" must keep its colours per Google's branding rules;
// Apple's glyph is monochrome and inherits the button's text colour.
export function GoogleLogo() {
  return (
    <svg className="provider-logo" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

export function AppleLogo() {
  return (
    <svg className="provider-logo" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.26 9.56c-.02-1.84 1.5-2.72 1.57-2.77-.86-1.25-2.19-1.42-2.66-1.44-1.13-.11-2.21.67-2.79.67-.57 0-1.46-.65-2.4-.64-1.24.02-2.38.72-3.02 1.83-1.28 2.23-.33 5.53.92 7.34.61.89 1.34 1.88 2.3 1.84.92-.04 1.27-.59 2.38-.59s1.43.59 2.4.57c.99-.02 1.62-.9 2.22-1.79.7-1.03.99-2.02 1-2.07-.02-.01-1.92-.74-1.94-2.93 Z M10.44 4.09c.5-.62.84-1.47.75-2.33-.72.03-1.6.48-2.12 1.09-.47.54-.88 1.41-.77 2.24.81.06 1.63-.41 2.14-1Z"
      />
    </svg>
  );
}
