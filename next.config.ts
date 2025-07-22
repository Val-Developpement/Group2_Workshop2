import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['xmtijwpecikbhstjpkqv.supabase.co'],
  },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localeDetection: false,
  },
};

export default nextConfig;
