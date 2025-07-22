'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getTranslation, Translations } from '@/lib/i18n';
import { useState, useEffect } from 'react';

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<string>('fr');
  
  // Extraire la locale du pathname ou utiliser le localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    const currentLocale = savedLocale || 'fr';
    setLocale(currentLocale);
  }, []);
  
  const t: Translations = getTranslation(locale);
  
  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    // Optionnel: recharger la page pour appliquer les changements
    window.location.reload();
  };
  
  return {
    t,
    locale,
    changeLanguage,
  };
} 