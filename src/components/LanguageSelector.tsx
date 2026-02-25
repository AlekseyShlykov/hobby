'use client';

import { useTestStore } from '@/lib/store';
import type { Locale } from '@/types';

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function LanguageSelector() {
  const { locale, setLocale } = useTestStore();

  return (
    <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            locale === lang.code
              ? 'shadow-lg'
              : 'hover:opacity-80'
          }`}
          style={{
            background: locale === lang.code ? 'var(--accent-primary)' : 'transparent',
            color: locale === lang.code ? 'white' : 'var(--text-secondary)'
          }}
          title={lang.label}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{lang.flag}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
