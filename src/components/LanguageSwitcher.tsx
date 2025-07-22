'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { t, locale, changeLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{t.language}</span>
          <span className="uppercase text-xs font-bold">
            {locale === 'fr' ? 'FR' : 'EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage('fr')}
          className={`cursor-pointer ${locale === 'fr' ? 'bg-accent' : ''}`}
        >
          🇫🇷 {t.french}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          className={`cursor-pointer ${locale === 'en' ? 'bg-accent' : ''}`}
        >
          🇬🇧 {t.english}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 