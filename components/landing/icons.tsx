import type { SVGProps } from "react";

export function GoogleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.13C3.25 21.31 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.26C.46 8.19 0 9.99 0 12s.46 3.81 1.26 5.41l4.02-3.13z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.26 6.59l4.02 3.13c.95-2.84 3.6-4.95 6.72-4.95z"
      />
    </svg>
  );
}

export function MicrosoftLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

export function AmazonLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path
        fill="#111827"
        d="M13.9 14.3c-1.8 1.4-4.5 1.5-6.7.4-.3-.2-.5-.1-.4.2.4.9 1.6 1.8 3.1 2.2 2.1.5 4.7.1 6.5-1.5.3-.3 0-.6-.3-.4l-2.2-.9zm1.7 1.8c.4-.5.8-1.3 1-2.1.1-.3-.2-.5-.4-.4-.7.3-1.8.8-2.6.9-.3 0-.3.4 0 .5.6.3 1.5.7 2 .1z"
      />
      <path
        fill="#111827"
        d="M10.9 4.5c-2.3 0-3.6 1.7-3.6 3.6 0 1.9 1.2 3.1 3 3.1 1 0 1.8-.4 2.3-1.1v1h2.2V4.7h-2.2v.9c-.5-.7-1.2-1.1-2.1-1.1zm.6 4.9c-.9 0-1.5-.7-1.5-1.5 0-.9.6-1.5 1.5-1.5.8 0 1.4.6 1.4 1.5 0 .9-.6 1.5-1.4 1.5z"
      />
      <path
        fill="#F59E0B"
        d="M6.2 16.5c2.9 1.8 6.7 1.7 9.8-.1.3-.2.6.1.4.4-3.4 2.2-7.8 2.3-10.7.2-.3-.2 0-.6.5-.5z"
      />
    </svg>
  );
}

export function MetaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...props}>
      <path
        d="M16.5 6C13.8 6 12.6 8.3 12 9.5 11.4 8.3 10.2 6 7.5 6 4 6 2 9 2 12.3c0 4.1 2.8 7.7 5.8 7.7 2.4 0 3.7-1.7 4.2-2.5.5.8 1.8 2.5 4.2 2.5 3 0 5.8-3.6 5.8-7.7C22 9 20 6 16.5 6zm-9 11.5c-2 0-3.8-2.4-3.8-5.2 0-2.4 1.3-4.2 3.8-4.2 2.2 0 3.4 2.5 4.1 4.5-.8 2.4-2.1 4.9-4.1 4.9zm9 0c-2 0-3.3-2.5-4.1-4.9.7-2 1.9-4.5 4.1-4.5 2.5 0 3.8 1.8 3.8 4.2 0 2.8-1.8 5.2-3.8 5.2z"
        fill="#0866FF"
      />
    </svg>
  );
}

export function TcsLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 20" width="26" height="18" fill="none" {...props}>
      <text
        x="0"
        y="14"
        fill="#E53935"
        fontWeight="800"
        fontSize="14"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.5px"
      >
        tcs
      </text>
    </svg>
  );
}

export function SpreadsheetsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" className="text-emerald-500 stroke-emerald-500 fill-emerald-50/40" />
      <path d="M3 9h18" className="stroke-emerald-500" />
      <path d="M3 15h18" className="stroke-emerald-500" />
      <path d="M9 3v18" className="stroke-emerald-500" />
      <path d="M15 3v18" className="stroke-emerald-500" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" className="fill-emerald-500" />
      <path
        d="M17.5 14.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.8.9-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.2.3-.4.1-.1.1-.2.2-.3 0-.1 0-.3-.1-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.5-.4z"
        fill="white"
      />
    </svg>
  );
}

export function XTwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
